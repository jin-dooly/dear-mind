-- 레벨 변경 제안: 이 시각 이후에 쓴 글만 "설정과 다른 레벨을 고른 횟수"로 셈
-- 기본 레벨을 저장하거나, 제안을 수락/거절하면 now()로 갱신 (앱에서 처리)
-- 기존 사용자는 적용 시점부터 새로 셈
alter table public.profiles
  add column level_counted_since timestamptz not null default now();
