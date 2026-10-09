/** 한국 날짜 (YYYY-MM-DD). 서버가 UTC여도 한국 자정 기준으로 날짜가 바뀜 */
function dateKST(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(date);
}

/** 작성 시각(ISO)을 한국 날짜(YYYY-MM-DD)로. 캘린더에서 같은 날 기록을 묶을 때 씀 */
export function dateKeyKST(iso: string) {
  return dateKST(new Date(iso));
}

/** 한국 날짜 기준 오늘 (YYYY-MM-DD) */
export function todayKST() {
  return dateKST(new Date());
}

/** 한국 날짜 기준으로 오늘 작성된 것인지 */
export function isTodayKST(iso: string) {
  return dateKeyKST(iso) === todayKST();
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
