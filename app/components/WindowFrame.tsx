import type { ReactNode } from "react";
import Link from "next/link";
import { Minus, Square, X } from "lucide-react";

// 모바일에서는 누르기 쉽게 크게, 넓은 화면에서는 작게.
// 얇은 테두리(1.5px)를 border로 주면 기기 배율에 따라 반올림이 한쪽으로 쏠려 아이콘이 치우쳐 보임.
// 안쪽 ring(box-shadow)은 상자 크기에 영향을 주지 않아서 아이콘이 가운데에 그대로 있음
const CONTROL_CLASS =
  "size-5 sm:size-4 shrink-0 ring-[1.5px] ring-inset ring-line rounded flex items-center justify-center text-[#8B96C7]";
const ICON_CLASS = "block size-2.5 sm:size-2";
const ICON_PROPS = { strokeWidth: 3, className: ICON_CLASS } as const;

/**
 * 창 크기 규칙. 화면이 넓어져도 창은 정해진 폭까지만 늘어나고 가운데 정렬됨
 * - sm 360px: 홈, 대화상자(에러·404)
 * - md 480px: 로그인, 온보딩, 설정, 질문, 분석
 * - lg 640px: 에디터, 기록 목록·상세 (글을 읽고 쓰는 화면, 한 줄 길이 기준)
 * - full: 폭 제한 없음. 모달처럼 바깥에서 폭을 정할 때
 */
const SIZE_CLASS = {
  sm: "max-w-90",
  md: "max-w-120",
  lg: "max-w-160",
  full: "max-w-none",
} as const;

/** 높이도 화면에 맞춰 늘어나되 이 이상은 늘어나지 않음 (넘치는 내용은 창 안에서 스크롤) */
const DEFAULT_MAX_HEIGHT = "max-h-180";

export function WindowFrame({
  title,
  children,
  size,
  maxHeight = DEFAULT_MAX_HEIGHT,
  className,
  closeHref,
  onClose,
}: {
  title: string;
  children: ReactNode;
  size: keyof typeof SIZE_CLASS;
  /** 기본 720px. 로그인처럼 더 작게 고정할 때만 지정 */
  maxHeight?: string;
  className?: string;
  /** 있으면 × 버튼이 이 경로로 이동하는 "닫기" 버튼이 됨 */
  closeHref?: string;
  /** 있으면 × 버튼이 이 함수를 부르는 "닫기" 버튼이 됨 (모달처럼 페이지 이동 없이 닫을 때) */
  onClose?: () => void;
}) {
  return (
    <div
      className={`${className ?? ""} w-full ${SIZE_CLASS[size]} ${maxHeight} relative z-10 rounded-2xl border-2 border-line bg-[#FBFAFF] overflow-hidden shadow-[0_8px_0_rgba(139,150,199,0.15)] flex flex-col grow min-h-0`}
    >
      <div className="bg-linear-to-b from-[#D7E4FB] to-[#C3D3F5] border-b-2 border-line px-3.5 py-2.5 flex items-center justify-between">
        <span className="font-jua text-[13px] text-ink">{title}</span>
        <div className="flex items-center gap-1.5">
          {/* 최소화·최대화는 장식. 닫기만 closeHref가 있을 때 동작 */}
          <span aria-hidden className={`${CONTROL_CLASS} bg-[#EDEBFB]`}>
            <Minus {...ICON_PROPS} />
          </span>
          <span aria-hidden className={`${CONTROL_CLASS} bg-[#EDEBFB]`}>
            <Square {...ICON_PROPS} className="block size-2 sm:size-1.5" />
          </span>
          {closeHref ? (
            <Link
              href={closeHref}
              aria-label="닫기"
              title="닫기"
              className={`${CONTROL_CLASS} bg-[#F5C9D9] hover:bg-[#EFA9C2] hover:text-ink-dark`}
            >
              <X {...ICON_PROPS} />
            </Link>
          ) : onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              title="닫기"
              className={`${CONTROL_CLASS} bg-[#F5C9D9] hover:bg-[#EFA9C2] hover:text-ink-dark`}
            >
              <X {...ICON_PROPS} />
            </button>
          ) : (
            <span aria-hidden className={`${CONTROL_CLASS} bg-[#F5C9D9]`}>
              <X {...ICON_PROPS} />
            </span>
          )}
        </div>
      </div>
      <div className="window-scroll p-5 flex flex-col grow min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
