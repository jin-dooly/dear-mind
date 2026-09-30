import type { Journal, Level, Question } from './types';

const BANK: Record<Level, string[]> = {
  1: [
    '오늘 하루 중 가장 기분 좋았던 순간은 언제였나요?',
    '오늘 점심(또는 저녁)엔 무엇을 먹었고, 맛은 어땠나요?',
    '지금 이 순간 창밖 날씨는 어떤가요? 그 날씨를 보면 어떤 기분이 드나요?',
  ],
  2: [
    '오늘 나를 웃게 한 사람이나 일이 있었나요?',
    '요즘 부쩍 자주 하는 생각이 있다면 무엇인가요?',
    '오늘 하루 중 조금 피하고 싶었던 순간이 있었나요?',
  ],
  3: [
    '최근에 나를 힘들게 하는 관계나 상황이 있다면 무엇인가요?',
    '요즘 스스로에게 가장 하고 싶은 말은 무엇인가요?',
    '지금 내가 가장 두려워하고 있는 것은 무엇인가요?',
  ],
  4: [
    '지금의 나는 예전에 바라던 모습과 얼마나 가까운가요?',
    '나를 가장 나답게 만드는 것은 무엇이라고 생각하나요?',
    '만약 오늘이 인생의 전환점이라면, 무엇을 바꾸고 싶나요?',
  ],
};

function hashToIndex(seed: string, length: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function clampLevel(n: number): Level {
  return Math.min(4, Math.max(1, n)) as Level;
}

/** 최근 기록(최근 5~7개) 중 level 최빈값. 기록 없으면 baseLevel 사용 */
export function recommendLevel(recentJournals: Journal[], baseLevel: Level): Level {
  const recent = recentJournals.slice(0, 7);
  if (recent.length === 0) return baseLevel;

  const counts = new Map<Level, number>();
  for (const j of recent) counts.set(j.level, (counts.get(j.level) ?? 0) + 1);

  let mode = baseLevel;
  let max = 0;
  for (const [level, count] of counts) {
    if (count > max) {
      max = count;
      mode = level;
    }
  }
  return mode;
}

/**
 * N-1, N, N+1 레벨의 질문 3개를 날짜 기준으로 결정적으로 뽑아온다.
 * batch(새로고침 횟수)만큼 밀어서 새로고침하면 다른 질문이 나오게 함.
 * (더미 구현, 추후 LLM Structured Output으로 교체)
 */
export function generateQuestions(
  centerLevel: Level,
  dateSeed: string,
  batch: number,
): Omit<Question, 'id'>[] {
  const levels = [clampLevel(centerLevel - 1), centerLevel, clampLevel(centerLevel + 1)];
  return levels.map((level, i) => {
    const pool = BANK[level];
    const index = (hashToIndex(`${dateSeed}-${level}-${i}`, pool.length) + batch) % pool.length;
    return { content: pool[index], level, type: 'daily' };
  });
}
