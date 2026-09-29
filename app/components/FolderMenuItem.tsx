import type { ReactNode } from "react";
import Link from "next/link";

type ColorScheme = "purple" | "pink" | "mint";

const schemes: Record<
  ColorScheme,
  { back: string; front: string; text: string; sub: string }
> = {
  purple: {
    back: "#8B6FBE",
    front: "#C9B8EA",
    text: "#4A3B7A",
    sub: "#7A63A8",
  },
  pink: { back: "#D98FB0", front: "#F7C6DA", text: "#8A3F5E", sub: "#B4658A" },
  mint: { back: "#5FAE85", front: "#B9E8D0", text: "#2E6B4A", sub: "#3E8564" },
};

export function FolderMenuItem({
  title,
  subtitle,
  icon,
  colorScheme,
  href,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  colorScheme: ColorScheme;
  href: string;
}) {
  const c = schemes[colorScheme];
  return (
    <div className="relative w-full h-[88px]">
      {/* <svg
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M14,8 H90 Q100,8 106,20 H278 Q292,20 292,34 V84 Q292,96 278,96 H14 Q2,96 2,84 V20 Q2,8 14,8 Z"
          fill={c.back}
        />
        <rect x={8} y={30} width={284} height={62} rx={14} fill={c.front} />
      </svg> */}
      <svg
        width="287"
        height="95"
        viewBox="0 0 287 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3933 7.6001H86.1C92.4778 7.6001 97.58 11.4001 101.407 19.0001H265.953C274.882 19.0001 279.347 23.4334 279.347 32.3001V79.8001C279.347 87.4001 274.882 91.2001 265.953 91.2001H13.3933C5.74 91.2001 1.91333 87.4001 1.91333 79.8001V19.0001C1.91333 11.4001 5.74 7.6001 13.3933 7.6001Z"
          fill={c.back}
        />
        <path
          d="M271.693 26.6001H12.4367C7.68149 26.6001 3.82666 30.4281 3.82666 35.1501V84.5501C3.82666 89.2721 7.68149 93.1001 12.4367 93.1001H271.693C276.448 93.1001 280.303 89.2721 280.303 84.5501V35.1501C280.303 30.4281 276.448 26.6001 271.693 26.6001Z"
          fill={c.front}
        />
      </svg>

      <Link
        href={href}
        className="absolute top-[34px] bottom-2 left-0 right-0 flex items-center gap-3.5 px-5 text-left"
      >
        <span className="shrink-0 text-white">{icon}</span>
        <span className="flex flex-col gap-0.5">
          <span className="font-jua text-[15px]" style={{ color: c.text }}>
            {title}
          </span>
          <span className="text-[11px]" style={{ color: c.sub }}>
            {subtitle}
          </span>
        </span>
      </Link>
    </div>
  );
}
