/**
 * 기록 보기 화면의 URL 상태 (?view=calendar&month=2026-10&date=2026-10-09).
 * 상세에서 닫고 돌아왔을 때 보던 탭·달·날짜가 그대로 유지되도록 URL에 남김
 */
export type RecordsView = 'list' | 'calendar';

export type RecordsQuery = {
  view: RecordsView;
  /** YYYY-MM. 캘린더에서 보고 있는 달 */
  month?: string;
  /** YYYY-MM-DD. 캘린더에서 고른 날짜 */
  date?: string;
};

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** 주소에 직접 이상한 값을 넣어도 화면이 깨지지 않게 형식이 맞는 값만 받음 */
export function parseRecordsQuery(params: RawParams): RecordsQuery {
  if (first(params.view) !== 'calendar') return { view: 'list' };
  const month = first(params.month);
  const date = first(params.date);
  return {
    view: 'calendar',
    month: month && MONTH_PATTERN.test(month) ? month : undefined,
    date: date && DATE_PATTERN.test(date) ? date : undefined,
  };
}

/** "?view=calendar&month=..." (목록이면 빈 문자열) */
export function recordsQueryString({ view, month, date }: RecordsQuery) {
  if (view === 'list') return '';
  const params = new URLSearchParams({ view });
  if (month) params.set('month', month);
  if (date) params.set('date', date);
  return `?${params.toString()}`;
}
