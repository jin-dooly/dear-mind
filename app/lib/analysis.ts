import type { AIAnalysis } from './types';

// 자해/위기 암시 표현 감지용 룰 기반 필터 (더미 구현, 추후 정교화 필요)
const CRISIS_PATTERNS = [/죽고\s*싶/, /자해/, /사라지고\s*싶/, /살고\s*싶지\s*않/];

const SAFETY_FALLBACK: AIAnalysis = {
  summary: '',
  toneKeywords: [],
  message:
    '지금 많이 힘든 시간을 보내고 계신 것 같아요. 혼자 견디지 않으셔도 괜찮아요.\n' +
    '자살예방상담전화 1393, 정신건강 위기상담전화 1577-0199로 언제든 연락하실 수 있어요.',
  isSafetyFallback: true,
};

function detectCrisis(content: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(content));
}

const KEYWORD_POOL = ['잔잔함', '설렘', '피곤함', '뿌듯함', '아쉬움', '평온함', '조급함', '고마움', '외로움', '기대감'];

function hashToIndex(seed: string, length: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % length;
}

/**
 * 더미 AI 분석. 실제로는 LLM에 content를 넘겨 Structured Output으로
 * { summary, tone_keywords, message } 를 받아오는 로직으로 교체 예정.
 * 실패/스키마 불일치 시 1회 재시도 후 안내 문구로 폴백하는 로직도 이후 추가.
 */
export function analyzeJournal(content: string): AIAnalysis {
  if (detectCrisis(content)) return SAFETY_FALLBACK;

  const keywords = [0, 1, 2].map((i) => KEYWORD_POOL[hashToIndex(`${content.length}-${i}-${content.slice(0, 5)}`, KEYWORD_POOL.length)]);

  return {
    summary: '이번 기록에는 지금의 마음을 들여다보며 느낀 감정들이 담겨 있어요. 작은 순간들을 놓치지 않고 바라본 시간이었네요.',
    toneKeywords: Array.from(new Set(keywords)),
    message: '정답이 없어도 괜찮아요. 지금의 나를 들여다봐 주셔서 고마워요.',
    isSafetyFallback: false,
  };
}
