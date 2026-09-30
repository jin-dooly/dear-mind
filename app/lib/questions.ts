import type { Level, Question } from './types';

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

/** 세트에 넣을 레벨 3개: 2개는 기본 레벨 N, 1개는 N-1/N/N+1 중 랜덤 (1~4 범위 안에서) */
function pickLevels(baseLevel: Level): Level[] {
  const candidates = [baseLevel - 1, baseLevel, baseLevel + 1].filter(
    (level): level is Level => level >= 1 && level <= 4,
  );
  const extra = candidates[Math.floor(Math.random() * candidates.length)];
  return [baseLevel, baseLevel, extra].sort((a, b) => a - b);
}

/**
 * 기본 레벨 기준으로 질문 3개를 뽑아온다.
 * 같은 레벨 질문이 겹치지 않도록 레벨마다 순서대로 다음 질문을 고르고,
 * batch(새로고침 횟수)만큼 밀어서 새로고침하면 다른 질문이 나오게 함.
 * (더미 구현, 추후 LLM Structured Output으로 교체)
 */
export function generateQuestions(
  baseLevel: Level,
  dateSeed: string,
  batch: number,
): Omit<Question, 'id'>[] {
  const used = new Map<Level, number>();
  return pickLevels(baseLevel).map((level) => {
    const nth = used.get(level) ?? 0;
    used.set(level, nth + 1);
    const pool = BANK[level];
    const index = (hashToIndex(`${dateSeed}-${level}`, pool.length) + batch + nth) % pool.length;
    return { content: pool[index], level, type: 'daily' };
  });
}
