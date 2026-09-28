import type { Journal, Question, UserProfile } from './types';

const PROFILE_KEY = 'dear-mind:profile';
const JOURNALS_KEY = 'dear-mind:journals';
const SELECTED_QUESTION_KEY = 'dear-mind:selected-question';
const PENDING_JOURNAL_KEY = 'dear-mind:pending-journal';

export const DEFAULT_PROFILE: UserProfile = {
  ageGroup: '20대',
  baseLevel: 1,
  nickname: '친구',
};

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
    const raw = typeof window === 'undefined' ? null : readRaw();
    if (hasCache && raw === lastRaw) return lastValue;
    lastRaw = raw;
    lastValue = parse(raw);
    hasCache = true;
    return lastValue;
  };
}

export const getProfile = cachedReader<UserProfile>(
  () => window.localStorage.getItem(PROFILE_KEY),
  (raw) => {
    if (!raw) return DEFAULT_PROFILE;
    try {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PROFILE;
    }
  }
);

export const getJournals = cachedReader<Journal[]>(
  () => window.localStorage.getItem(JOURNALS_KEY),
  (raw) => {
    if (!raw) return [];
    try {
      return (JSON.parse(raw) as Journal[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
      return [];
    }
  }
);

export const getSelectedQuestion = cachedReader<Question | null>(
  () => window.sessionStorage.getItem(SELECTED_QUESTION_KEY),
  (raw) => (raw ? (JSON.parse(raw) as Question) : null)
);

export const getPendingJournal = cachedReader<Journal | null>(
  () => window.sessionStorage.getItem(PENDING_JOURNAL_KEY),
  (raw) => (raw ? (JSON.parse(raw) as Journal) : null)
);

export function getJournal(id: string): Journal | undefined {
  return getJournals().find((j) => j.id === id);
}

export function saveProfile(profile: Partial<UserProfile>) {
  const next = { ...getProfile(), ...profile };
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}

export function addJournal(journal: Journal) {
  window.localStorage.setItem(JOURNALS_KEY, JSON.stringify([journal, ...getJournals()]));
}

export function setSelectedQuestion(question: Question) {
  window.sessionStorage.setItem(SELECTED_QUESTION_KEY, JSON.stringify(question));
}

export function setPendingJournal(journal: Journal) {
  window.sessionStorage.setItem(PENDING_JOURNAL_KEY, JSON.stringify(journal));
}

export function clearWriteSession() {
  window.sessionStorage.removeItem(SELECTED_QUESTION_KEY);
  window.sessionStorage.removeItem(PENDING_JOURNAL_KEY);
}
