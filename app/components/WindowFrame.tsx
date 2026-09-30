import type { ReactNode } from "react";
import Link from "next/link";
import { Minus, Square, X } from "lucide-react";

const CONTROL_CLASS =
  "w-3.5 h-3.5 border-[1.5px] border-[#8B96C7] rounded-sm flex items-center justify-center text-[#8B96C7]";
const ICON_PROPS = { size: 9, strokeWidth: 3 } as const;

export function WindowFrame({
  title,
  children,
  className,
  closeHref,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  /** 있으면 × 버튼이 이 경로로 이동하는 "닫기" 버튼이 됨 */
  closeHref?: string;
}) {
  return (
    <div
      className={`${className ?? ""} relative z-10 rounded-2xl border-2 border-[#8B96C7] bg-[#FBFAFF] overflow-hidden shadow-[0_8px_0_rgba(139,150,199,0.15)] flex flex-col grow`}
    >
      <div className="bg-linear-to-b from-[#D7E4FB] to-[#C3D3F5] border-b-2 border-[#8B96C7] px-3.5 py-2.5 flex items-center justify-between">
        <span className="font-jua text-[13px] text-ink">{title}</span>
        <div className="flex gap-1.5">
          {/* 최소화·최대화는 장식. 닫기만 closeHref가 있을 때 동작 */}
          <span aria-hidden className={`${CONTROL_CLASS} bg-[#EDEBFB]`}>
            <Minus {...ICON_PROPS} />
          </span>
          <span aria-hidden className={`${CONTROL_CLASS} bg-[#EDEBFB]`}>
            <Square {...ICON_PROPS} size={7} />
          </span>
          {closeHref ? (
            <Link
              href={closeHref}
              aria-label="닫기"
              title="닫기"
              className={`${CONTROL_CLASS} bg-[#F5C9D9] hover:bg-[#EFA9C2] hover:text-ink-dark focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink-dark`}
            >
              <X {...ICON_PROPS} />
            </Link>
          ) : (
            <span aria-hidden className={`${CONTROL_CLASS} bg-[#F5C9D9]`}>
              <X {...ICON_PROPS} />
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col grow">{children}</div>
    </div>
  );
}
