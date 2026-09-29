import type { ReactNode } from "react";

export function WindowFrame({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${className ?? ""} relative z-10 rounded-2xl border-2 border-[#8B96C7] bg-[#FBFAFF] overflow-hidden shadow-[0_8px_0_rgba(139,150,199,0.15)] flex flex-col grow`}
    >
      <div className="bg-linear-to-b from-[#D7E4FB] to-[#C3D3F5] border-b-2 border-[#8B96C7] px-3.5 py-2.5 flex items-center justify-between">
        <span className="font-jua text-[13px] text-ink">{title}</span>
        <div className="flex gap-1.5">
          <span className="w-3.5 h-3.5 border-[1.5px] border-[#8B96C7] rounded-sm bg-[#EDEBFB]" />
          <span className="w-3.5 h-3.5 border-[1.5px] border-[#8B96C7] rounded-sm bg-[#EDEBFB]" />
          <span className="w-3.5 h-3.5 border-[1.5px] border-[#8B96C7] rounded-sm bg-[#F5C9D9]" />
        </div>
      </div>
      <div className="p-5 flex flex-col grow">{children}</div>
    </div>
  );
}
