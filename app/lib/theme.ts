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
