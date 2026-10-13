/**
 * 화면 테마. 쿠키가 없으면 기기 설정(시스템)을 따라가고,
 * 홈의 토글을 한 번이라도 누르면 그 값이 쿠키에 남아 다음 방문에도 그대로 시작함
 */
export type Theme = "light" | "dark";

export const THEME_COOKIE = "theme";

/** 1년 */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseTheme(value: string | undefined): Theme | undefined {
  return value === "light" || value === "dark" ? value : undefined;
}

/**
 * 토글을 두는 화면 컨테이너에 붙이는 위 여백.
 * 휴대폰에서는 창이 화면 위까지 차서 떠 있는 토글(top-4 + 높이 36px = 52px)이 제목줄을 가리므로
 * 창을 그 아래(64px)부터 시작하게 함. 높이가 낮은 휴대폰은 토글이 자리를 차지하므로 원래 여백으로
 */
export const THEME_TOGGLE_SPACE_CLASS = "max-sm:pt-16 short-mobile:pt-7";
