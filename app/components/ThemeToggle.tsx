"use client";

import { useSyncExternalStore } from "react";
import { THEME_COOKIE, THEME_COOKIE_MAX_AGE, type Theme } from "@/app/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/** 지금 보이는 테마. 고른 적이 없으면(data-theme 없음) 기기 설정 */
function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** 토글로 바꿀 때(data-theme)와, 고른 적 없이 기기 설정이 바뀔 때 다시 읽음 */
function subscribe(onChange: () => void) {
  const media = matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

/**
 * 라이트/다크 전환 스위치 (로그인·홈 화면 배경 오른쪽 위).
 * 누르면 바로 바뀌고 쿠키에 남아서, 다음에 들어올 때 서버가 그 테마로 그림 (app/layout.tsx)
 *
 * 화면 컨테이너(relative, 세로 flex)의 창 바로 앞에 둠.
 * 높이가 낮은 휴대폰(short-mobile)에서는 창이 위에 바짝 붙어 떠 있는 토글이 제목줄을 가리므로,
 * 떠 있지 않고 창 바로 위 오른쪽에 자리를 차지함
 */
export function ThemeToggle() {
  // 서버는 기기 설정을 몰라서 null. 손잡이 위치·아이콘은 CSS(dark:)가 정해 처음부터 맞게 보이고,
  // 이 값은 스크린 리더에 알려 줄 켜짐/꺼짐 상태에만 씀
  const theme = useSyncExternalStore(subscribe, currentTheme, () => null);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  }

  return (
    <div className="absolute top-4 right-4 z-20 short-mobile:static short-mobile:self-end short-mobile:mb-2">
      <button
        type="button"
        role="switch"
        aria-checked={theme === "dark"}
        aria-label="다크 모드"
        title="다크 모드"
        onClick={toggle}
        className="relative h-9 w-16 shrink-0 rounded-full border-2 border-line bg-toggle-track shadow-toggle"
      >
        {/* 트랙 안쪽 폭 60px - 손잡이 26px - 양쪽 여백 3px = 28px 이동 */}
        <span className="absolute top-[3px] left-[3px] flex size-[26px] items-center justify-center rounded-full border-2 border-line bg-toggle-knob shadow-toggle-knob transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none dark:translate-x-7">
          <SunIcon className="size-4 text-sun dark:hidden" />
          <MoonStarsIcon className="hidden size-4 text-moon dark:block" />
        </span>
      </button>
    </div>
  );
}

function SunIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <path d="M12 1.5v2.5M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12h2.5M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  );
}

/** 초승달 + 반짝이 두 개 */
function MoonStarsIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      <path d="M17.5 2.6Q17.5 5.5 20.4 5.5Q17.5 5.5 17.5 8.4Q17.5 5.5 14.6 5.5Q17.5 5.5 17.5 2.6Z" />
      <path d="M21.2 8.4Q21.2 10 22.8 10Q21.2 10 21.2 11.6Q21.2 10 19.6 10Q21.2 10 21.2 8.4Z" />
    </svg>
  );
}
