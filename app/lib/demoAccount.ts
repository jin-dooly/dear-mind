/**
 * 채용 담당자 등이 Google 계정 없이 둘러볼 수 있는 체험 계정.
 * 로그인 화면과 README에 그대로 공개하는 값이라 비밀이 아님.
 * 계정 생성·초기화는 scripts/seed-demo.mjs (같은 값을 씀)
 */
export const DEMO_ACCOUNT = { id: "demo", password: "dearmind1234" } as const;

/**
 * 아이디로 로그인하지만 Supabase는 이메일로 로그인하므로 이메일 주소로 바꿈.
 * example.com은 실제 메일이 가지 않는 예약 도메인
 */
export function loginIdToEmail(id: string) {
  return `${id}@dear-mind.example.com`;
}
