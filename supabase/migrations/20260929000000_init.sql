-- dear-mind 초기 스키마: profiles, questions, journals, ai_analyses + RLS

-- ─────────────────────────────────────────────
-- profiles: 사용자 프로필 (auth.users와 1:1)
-- ─────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- 온보딩 전에는 비어 있음
  age_group text check (age_group in ('10대', '20대', '30대', '40대', '50대 이상')),
  base_level smallint check (base_level between 1 and 4),
  nickname text not null default '친구',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- questions: 사용자에게 제시된 질문 (LLM 생성)
-- ─────────────────────────────────────────────
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  level smallint not null check (level between 1 and 4),
  type text not null default 'daily',
  created_at timestamptz not null default now()
);

create index questions_user_id_created_at_idx
  on public.questions (user_id, created_at desc);

-- ─────────────────────────────────────────────
-- journals: 작성한 글
-- ─────────────────────────────────────────────
create table public.journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid references public.questions (id) on delete set null,
  -- 질문이 삭제돼도 기록에서 질문을 보여줄 수 있도록 내용을 함께 저장
  question_content text not null,
  level smallint not null check (level between 1 and 4),
  content text not null,
  created_at timestamptz not null default now()
);

create index journals_user_id_created_at_idx
  on public.journals (user_id, created_at desc);

-- ─────────────────────────────────────────────
-- ai_analyses: 글에 대한 AI 분석 (journals와 1:1)
-- ─────────────────────────────────────────────
create table public.ai_analyses (
  journal_id uuid primary key references public.journals (id) on delete cascade,
  summary text not null default '',
  tone_keywords text[] not null default '{}',
  message text not null,
  -- 위기 표현 감지로 고정 안내 문구를 보여준 경우
  is_safety_fallback boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- updated_at 자동 갱신
-- ─────────────────────────────────────────────
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- 회원가입 시 profiles 행 자동 생성
-- ─────────────────────────────────────────────
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      '친구'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- 권한: 로그인한 사용자만 접근, 익명 사용자는 차단
-- ─────────────────────────────────────────────
revoke all on public.profiles, public.questions, public.journals, public.ai_analyses from anon;
grant select, insert, update, delete
  on public.profiles, public.questions, public.journals, public.ai_analyses
  to authenticated;

-- ─────────────────────────────────────────────
-- RLS: 본인 데이터만 읽고 쓸 수 있음
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.journals enable row level security;
alter table public.ai_analyses enable row level security;

-- profiles (행 생성은 트리거가 담당하므로 insert/delete 정책 없음)
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- questions
create policy "questions_select_own" on public.questions
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "questions_insert_own" on public.questions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "questions_delete_own" on public.questions
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- journals
create policy "journals_select_own" on public.journals
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "journals_insert_own" on public.journals
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "journals_update_own" on public.journals
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "journals_delete_own" on public.journals
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ai_analyses (소유권은 연결된 journal로 판단)
create policy "ai_analyses_select_own" on public.ai_analyses
  for select to authenticated
  using (exists (
    select 1 from public.journals j
    where j.id = journal_id and j.user_id = (select auth.uid())
  ));

create policy "ai_analyses_insert_own" on public.ai_analyses
  for insert to authenticated
  with check (exists (
    select 1 from public.journals j
    where j.id = journal_id and j.user_id = (select auth.uid())
  ));

create policy "ai_analyses_update_own" on public.ai_analyses
  for update to authenticated
  using (exists (
    select 1 from public.journals j
    where j.id = journal_id and j.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.journals j
    where j.id = journal_id and j.user_id = (select auth.uid())
  ));
