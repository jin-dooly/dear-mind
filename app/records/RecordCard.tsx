import Link from 'next/link';
import { LevelBadge } from '@/app/components/LevelBadge';
import { formatDate } from '@/app/lib/format';
import type { Journal } from '@/app/lib/types';

/** 기록 목록·캘린더에서 쓰는 기록 카드. query는 상세에서 닫았을 때 돌아올 탭·날짜 */
export function RecordCard({ journal, query = '' }: { journal: Journal; query?: string }) {
  return (
    <Link
      href={`/records/${journal.id}${query}`}
      className="w-full rounded-xl border-2 border-line bg-white px-4 py-3.5 text-left"
    >
      <div className="flex items-center justify-between mb-1.5">
        <LevelBadge level={journal.level} />
        <span className="text-[11px] text-muted">{formatDate(journal.createdAt)}</span>
      </div>
      <p className="text-[12px] text-muted mb-1 line-clamp-1">{journal.questionContent}</p>
      <p className="text-[13px] text-ink line-clamp-2 leading-relaxed">{journal.content}</p>
    </Link>
  );
}
