import type { Question } from "./types";

// 질문 선택 → 글쓰기 사이에서만 쓰는 임시 데이터.
// 프로필과 저장된 기록은 Supabase(app/lib/db.ts, app/lib/actions.ts)에서 관리.
const SELECTED_QUESTION_KEY = "dear-mind:selected-question";

/**
 * Wraps a storage read so repeated calls return the SAME object reference
 * whenever the underlying raw string hasn't changed. useSyncExternalStore
 * compares snapshots with Object.is, so an uncached reader (new array/object
 * on every call) would trigger an infinite-loop warning.
 */
function cachedReader<T>(readRaw: () => string | null, parse: (raw: string | null) => T): () => T {
  let hasCache = false;
  let lastRaw: string | null = null;
  let lastValue: T;
  return () => {
    const raw = typeof window === "undefined" ? null : readRaw();
    if (hasCache && raw === lastRaw) return lastValue;
    lastRaw = raw;
    lastValue = parse(raw);
    hasCache = true;
    return lastValue;
  };
}

export const getSelectedQuestion = cachedReader<Question | null>(
  () => window.sessionStorage.getItem(SELECTED_QUESTION_KEY),
  (raw) => (raw ? (JSON.parse(raw) as Question) : null)
);

export function setSelectedQuestion(question: Question) {
  window.sessionStorage.setItem(SELECTED_QUESTION_KEY, JSON.stringify(question));
}
