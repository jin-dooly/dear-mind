import 'server-only';
import { z } from 'zod';
import { generateStructured } from './llm';
import { LEVEL_INFO, LEVELS, levelLabel } from './levels';
import type { AgeGroup, Level, Question } from './types';

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

/** LLM을 쓸 수 없을 때 쓰는 질문 은행. 날짜·batch 기준으로 결정적으로 고름 */
function pickFromBank(levels: Level[], dateSeed: string, batch: number): Omit<Question, 'id'>[] {
  const used = new Map<Level, number>();
  return levels.map((level) => {
    const nth = used.get(level) ?? 0;
    used.set(level, nth + 1);
    const pool = BANK[level];
    const index = (hashToIndex(`${dateSeed}-${level}`, pool.length) + batch + nth) % pool.length;
    return { content: pool[index], level, type: 'daily' };
  });
}

const QUESTION_SYSTEM = `당신은 자기성찰 기록 서비스 "dear-mind"의 질문을 쓰는 작가예요.
서비스의 한 줄 소개는 "정답을 찾기보다, 지금의 나를 알아가는 시간"이에요.
사용자는 질문 하나를 골라 짧은 글을 쓰며 자신을 돌아봐요. 매일 써야 하는 숙제가 아니라 마음이 향할 때 찾는 공간이에요.

질문의 깊이는 레벨로 나뉘어요.
${LEVELS.map((l) => `- Lv.${l} ${LEVEL_INFO[l].name}: ${LEVEL_INFO[l].description}`).join('\n')}

좋은 질문은 이래요.
- 한국어 해요체, 물음표로 끝나는 한 문장 (40자 안팎)
- 정답이 없고, 떠오르는 대로 편하게 답할 수 있음
- 같은 세트 안에서 서로 다른 소재를 다룸
- 나이대에 어울리는 소재를 고르되, 나이대에 대한 고정관념은 피함

이 서비스는 상담이나 치료가 아니에요. 진단하거나 조언하려는 질문, 트라우마나 위기 상황을 직접 떠올리게 하는 질문은 쓰지 않아요.`;

const QuestionSetSchema = z.object({
  questions: z.array(z.object({ content: z.string() })),
});

/**
 * 질문 3개를 만든다. 레벨 구성(N 2개 + N-1/N/N+1 중 1개)은 코드가 정하고,
 * 각 레벨에 맞는 질문 문장은 LLM이 Structured Output으로 한 번에 써 줌.
 * LLM 호출이 실패하면 질문 은행에서 골라 서비스가 멈추지 않게 함.
 */
export async function generateQuestions({
  ageGroup,
  baseLevel,
  dateSeed,
  batch,
  avoid,
}: {
  ageGroup: AgeGroup;
  baseLevel: Level;
  dateSeed: string;
  batch: number;
  /** 최근에 받았거나 답한 질문. 비슷한 질문이 반복되지 않게 함 */
  avoid: string[];
}): Promise<Omit<Question, 'id'>[]> {
  const levels = pickLevels(baseLevel);

  const prompt = [
    `사용자 나이대: ${ageGroup}`,
    '',
    '아래 순서대로 질문 3개를 만들어 주세요.',
    ...levels.map((level, i) => `${i + 1}. ${levelLabel(level)}`),
    ...(avoid.length > 0
      ? ['', '최근에 이미 받은 질문들이에요. 이것들과 겹치거나 비슷한 질문은 피해 주세요.', ...avoid.map((q) => `- ${q}`)]
      : []),
  ].join('\n');

  try {
    const { questions } = await generateStructured({
      label: 'questions',
      system: QUESTION_SYSTEM,
      prompt,
      schema: QuestionSetSchema,
      validate: ({ questions }) => {
        if (questions.length !== levels.length || questions.some((q) => !q.content.trim())) {
          throw new Error(`expected ${levels.length} questions, got ${questions.length}`);
        }
      },
    });
    return questions.map((q, i) => ({ content: q.content.trim(), level: levels[i], type: 'daily' }));
  } catch (error) {
    console.error('[questions] LLM 질문 생성 실패, 질문 은행으로 대체', error);
    return pickFromBank(levels, dateSeed, batch);
  }
}
