-- 오늘의 질문 세트: 하루에 받은 질문 3개를 저장해 재사용하고, 새로고침 횟수를 추적

-- question_date: 한국 날짜 기준 "오늘"
-- batch: 그날의 몇 번째 세트인지 (0 = 처음 받은 세트, 새로고침할 때마다 +1)
-- position: 세트 안에서의 순서 (0~2)
alter table public.questions
  add column question_date date,
  add column batch smallint not null default 0 check (batch >= 0),
  add column position smallint check (position between 0 and 2);

-- 기존 행은 생성 시각의 한국 날짜로 채움. position은 비워 두어 세트 조회 대상에서 제외
update public.questions
  set question_date = (created_at at time zone 'Asia/Seoul')::date;

alter table public.questions
  alter column question_date set not null;

-- 같은 날·같은 세트·같은 자리에 질문이 두 번 들어가지 않도록 (동시 요청 대비)
create unique index questions_daily_set_key
  on public.questions (user_id, question_date, batch, position);
