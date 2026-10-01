import { levelBgClass, levelLabel } from '@/app/lib/levels';
import type { Level } from '@/app/lib/types';

/** 질문·기록 카드에 붙는 레벨 뱃지 ("Lv.3 깊게") */
export function LevelBadge({ level, className = '' }: { level: Level; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-jua text-ink-dark ${levelBgClass(level)} ${className}`}
    >
      {levelLabel(level)}
    </span>
  );
}
