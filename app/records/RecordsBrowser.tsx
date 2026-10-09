'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { dateKeyKST } from '@/app/lib/format';
import { levelBgClass } from '@/app/lib/levels';
import type { Journal } from '@/app/lib/types';
import { RecordCard } from './RecordCard';
import { recordsQueryString, type RecordsQuery, type RecordsView } from './recordsQuery';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
/** 하루 칸에 찍는 레벨 점 최대 개수. 넘치면 점은 3개까지만 보이고 목록에서 전부 볼 수 있음 */
const MAX_DOTS = 3;

/** "2026-10" + delta달 → "2026-11" */
function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** 달력 칸 목록. 1일 앞의 빈칸은 null */
function monthCells(month: string) {
  const [y, m] = month.split('-').map(Number);
  const leading = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return [
    ...Array<null>(leading).fill(null),
    ...Array.from({ length: days }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`),
  ];
}

/** "2026-10" → "10월", "2026-10-09" → "10월 9일" */
function monthDayLabel(key: string) {
  const [, m, d] = key.split('-').map(Number);
  return d ? `${m}월 ${d}일` : `${m}월`;
}

/**
 * 기록 보기의 목록/캘린더 탭. 탭·달·날짜를 바꿀 때마다 서버에 다시 묻지 않고 바로 바꾸고,
 * 주소(?view=calendar&...)만 갈아 끼워서 상세에서 돌아왔을 때 보던 화면이 유지됨
 */
export function RecordsBrowser({
  heading,
  journals,
  today,
  initialQuery,
}: {
  /** 화면 제목. 오른쪽에 목록/캘린더 전환 버튼이 붙음 */
  heading: ReactNode;
  /** 최신순 */
  journals: Journal[];
  /** 한국 날짜 기준 오늘 (YYYY-MM-DD). 서버와 브라우저가 같은 값을 쓰도록 서버에서 받음 */
  today: string;
  initialQuery: RecordsQuery;
}) {
  const [query, setQuery] = useState(initialQuery);

  function update(next: RecordsQuery) {
    setQuery(next);
    window.history.replaceState(null, '', `/records${recordsQueryString(next)}`);
  }

  const queryString = recordsQueryString(query);

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-6">
        {heading}
        <ViewToggle view={query.view} onChange={(view) => update({ view })} />
      </div>
      {query.view === 'list' ? (
        <div className="flex flex-col gap-3 py-0.5">
          {journals.map((j) => (
            <RecordCard key={j.id} journal={j} />
          ))}
        </div>
      ) : (
        <RecordsCalendar journals={journals} today={today} query={query} queryString={queryString} onChange={update} />
      )}
    </>
  );
}

const VIEW_OPTIONS = [
  { value: 'list', label: '목록으로 보기', Icon: List },
  { value: 'calendar', label: '캘린더로 보기', Icon: CalendarDays },
] as const;

/** 제목 오른쪽의 목록/캘린더 아이콘 전환 버튼 */
function ViewToggle({ view, onChange }: { view: RecordsView; onChange: (view: RecordsView) => void }) {
  return (
    <div className="flex gap-0.5 shrink-0 rounded-lg border-2 border-line-soft bg-white p-0.5">
      {VIEW_OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          title={label}
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className={`size-7 rounded-md flex items-center justify-center transition-colors ${
            view === value ? 'bg-sky-light text-ink-dark' : 'text-muted hover:text-ink'
          }`}
        >
          <Icon className="size-4" strokeWidth={2.25} />
        </button>
      ))}
    </div>
  );
}

function RecordsCalendar({
  journals,
  today,
  query,
  queryString,
  onChange,
}: {
  journals: Journal[];
  today: string;
  query: RecordsQuery;
  queryString: string;
  onChange: (next: RecordsQuery) => void;
}) {
  // 날짜별로 묶음. 점은 그날 쓴 순서대로 찍히도록 오래된 글부터
  const byDate = useMemo(() => {
    const map = new Map<string, Journal[]>();
    for (const j of [...journals].reverse()) {
      const key = dateKeyKST(j.createdAt);
      map.set(key, [...(map.get(key) ?? []), j]);
    }
    return map;
  }, [journals]);

  const thisMonth = today.slice(0, 7);
  const month = query.month ?? query.date?.slice(0, 7) ?? thisMonth;
  // 첫 기록이 있는 달부터 이번 달까지만 넘겨 볼 수 있음
  const firstMonth = journals.length ? dateKeyKST(journals[journals.length - 1].createdAt).slice(0, 7) : thisMonth;
  const canPrev = month > firstMonth;
  const canNext = month < thisMonth;

  const selected = query.date?.startsWith(month) ? query.date : undefined;
  const shown = selected
    ? [...(byDate.get(selected) ?? [])].reverse()
    : journals.filter((j) => dateKeyKST(j.createdAt).startsWith(month));

  const [year, monthNumber] = month.split('-').map(Number);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <MonthButton
          label="이전 달"
          disabled={!canPrev}
          onClick={() => onChange({ view: 'calendar', month: shiftMonth(month, -1) })}
        >
          <ChevronLeft className="size-4" strokeWidth={2.5} />
        </MonthButton>
        <span className="font-jua text-[15px] text-ink" aria-live="polite">
          {year}년 {monthNumber}월
        </span>
        <MonthButton
          label="다음 달"
          disabled={!canNext}
          onClick={() => onChange({ view: 'calendar', month: shiftMonth(month, 1) })}
        >
          <ChevronRight className="size-4" strokeWidth={2.5} />
        </MonthButton>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center mb-6">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[11px] text-muted pb-1">
            {day}
          </span>
        ))}
        {monthCells(month).map((key, i) => {
          if (!key) return <span key={`blank-${i}`} />;
          const entries = byDate.get(key) ?? [];
          const day = Number(key.slice(8));
          const isToday = key === today;
          const dayClass = `flex flex-col items-center justify-start gap-1 h-11 pt-1.5 rounded-lg text-[13px] ${
            isToday ? 'font-jua text-ink-dark' : ''
          }`;

          if (entries.length === 0) {
            return (
              <span key={key} className={`${dayClass} ${isToday ? '' : 'text-muted/70'}`}>
                {day}
              </span>
            );
          }

          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${monthDayLabel(key)}, 기록 ${entries.length}개`}
              onClick={() => onChange({ view: 'calendar', month, date: isSelected ? undefined : key })}
              className={`${dayClass} transition-colors ${
                isSelected ? 'bg-sky-light ring-2 ring-inset ring-line text-ink-dark' : 'text-ink hover:bg-sky-light/60'
              }`}
            >
              {day}
              <span aria-hidden className="flex gap-0.5">
                {entries.slice(0, MAX_DOTS).map((j) => (
                  // Lv.1 색이 아주 연해서 흰 배경에서도 보이도록 옅은 테두리를 둠
                  <span key={j.id} className={`size-1.5 rounded-full ring-1 ring-line-soft ${levelBgClass(j.level)}`} />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <p className="font-jua text-[14px] text-ink mb-3">
        {monthDayLabel(selected ?? month)}의 기록
        {/* 제목과 구분되게 본문 글꼴로 작게. 색은 대비 4.5:1을 지키는 muted보다 연하게 하지 않음 */}
        <span className="ml-1 font-sans text-[12px] text-muted">({shown.length})</span>
      </p>
      {shown.length === 0 ? (
        <p className="text-[13px] text-muted text-center py-6">이 달에는 쓴 기록이 없어요</p>
      ) : (
        <div className="flex flex-col gap-3 py-0.5">
          {shown.map((j) => (
            <RecordCard key={j.id} journal={j} query={queryString} />
          ))}
        </div>
      )}
    </>
  );
}

function MonthButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="size-7 rounded-lg flex items-center justify-center text-ink hover:bg-sky-light disabled:opacity-30 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
}
