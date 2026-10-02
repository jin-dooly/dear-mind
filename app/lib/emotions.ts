/**
 * AI 분석 키워드로 쓸 수 있는 감정 단어 (40개).
 * - 글쓴이가 느끼는 감정만 담음. 사람·성격을 평가하는 단어(게으름, 가벼움 등)는 넣지 않음
 * - 진단처럼 들리는 단어(우울, 무기력 등)는 넣지 않음
 * - 비슷한 단어는 하나로 합쳐 나중에 감정 통계를 낼 때 같은 감정이 따로 집계되지 않게 함
 * 분류는 다음 스프린트에서 키워드 칩 색을 나눌 때 사용 예정
 */
export const EMOTION_GROUPS = {
  bright: ['기쁨', '즐거움', '행복', '설렘', '뿌듯함', '만족', '감사', '기대', '자신감', '홀가분함'],
  calm: ['평온함', '편안함', '잔잔함', '안도', '여유', '담담함', '그리움', '애틋함'],
  forward: ['다짐', '의욕', '용기', '희망', '호기심', '깨달음'],
  heavy: [
    '아쉬움', '걱정', '불안', '서운함', '외로움', '피곤함', '지침', '답답함',
    '속상함', '후회', '조급함', '막막함', '혼란', '낯섦', '부담감', '슬픔',
  ],
} as const;

export type Emotion = (typeof EMOTION_GROUPS)[keyof typeof EMOTION_GROUPS][number];

export const EMOTIONS = Object.values(EMOTION_GROUPS).flat() as [Emotion, ...Emotion[]];
