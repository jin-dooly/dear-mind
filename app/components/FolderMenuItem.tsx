import type { ReactNode } from 'react';
import Link from 'next/link';

type ColorScheme = 'purple' | 'pink' | 'mint';

const schemes: Record<ColorScheme, { back: string; front: string; text: string; sub: string }> = {
  purple: { back: '#8B6FBE', front: '#C9B8EA', text: '#4A3B7A', sub: '#7A63A8' },
  pink: { back: '#D98FB0', front: '#F7C6DA', text: '#8A3F5E', sub: '#B4658A' },
  mint: { back: '#5FAE85', front: '#B9E8D0', text: '#2E6B4A', sub: '#3E8564' },
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
      <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <path
          d="M14,8 H90 Q100,8 106,20 H278 Q292,20 292,34 V84 Q292,96 278,96 H14 Q2,96 2,84 V20 Q2,8 14,8 Z"
          fill={c.back}
          stroke="#2E2A45"
          strokeWidth={4}
        />
        <rect x={8} y={30} width={284} height={62} rx={14} fill={c.front} stroke="#2E2A45" strokeWidth={3.5} />
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
