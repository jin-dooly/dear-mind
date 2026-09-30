/** 한국 날짜 기준 오늘 (YYYY-MM-DD). 서버가 UTC여도 자정에 날짜가 바뀜 */
export function todayKST() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
}

/** 서버(UTC)에서 렌더링해도 한국 날짜로 표시되도록 시간대를 고정 */
export function formatDate(iso: string) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}.${get("month")}.${get("day")}`;
}
