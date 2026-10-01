import type { Level } from "@/app/lib/types";

/** 레벨 이름·설명. 온보딩, 설정, 질문 카드, 레벨 제안 등 모든 화면이 이 값을 씀 */
export const LEVEL_INFO: Record<Level, { name: string; description: string }> = {
  1: { name: "가볍게", description: "오늘 있었던 일을 가볍게 떠올려 봐요" },
  2: { name: "조금 더", description: "요즘 드는 생각을 조금 더 들여다봐요" },
  3: { name: "깊게", description: "마음 한 켠의 감정을 깊게 마주해요" },
  4: { name: "아주 깊게", description: "나 자신에 대해 아주 깊이 성찰해요" },
};

export const LEVELS: Level[] = [1, 2, 3, 4];

/** "Lv.3 깊게" */
export function levelLabel(level: Level) {
  return `Lv.${level} ${LEVEL_INFO[level].name}`;
}

/**
 * 레벨 배경색 클래스 (globals.css의 --color-level-N 토큰).
 * @theme inline이라 CSS 변수는 따로 생기지 않으므로 var()가 아닌 클래스로 써야 하고,
 * Tailwind가 찾을 수 있도록 클래스 이름을 문자열 그대로 적어 둠
 */
const LEVEL_BG_CLASS: Record<Level, string> = {
  1: "bg-level-1",
  2: "bg-level-2",
  3: "bg-level-3",
  4: "bg-level-4",
};

export function levelBgClass(level: Level) {
  return LEVEL_BG_CLASS[level];
}
