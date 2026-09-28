'use client';

import Link from 'next/link';
import { WindowFrame } from '@/app/components/WindowFrame';
import { useHasMounted } from '@/app/lib/useHasMounted';
import { getJournals } from '@/app/lib/storage';

const LEVEL_COLOR: Record<number, string> = {
  1: '#DCEFFB',
  2: '#E3E3FB',
  3: '#F0D9F5',
  4: '#C9B8EA',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function RecordsPage() {
  const hasMounted = useHasMounted();
  const journals = hasMounted ? getJournals() : [];

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="RECORDS">
        <p className="text-[13px] text-muted mb-1">지난 기록들을 다시 읽어보세요</p>
        <h1 className="font-jua text-lg text-ink mb-6">기록 보기</h1>

        <div className="flex flex-col gap-3 grow overflow-y-auto">
          {journals.length === 0 && (
            <p className="text-[13px] text-muted text-center mt-10">아직 작성한 기록이 없어요</p>
          )}
          {journals.map((j) => (
            <Link
              key={j.id}
              href={`/records/${j.id}`}
              className="w-full rounded-xl border-2 border-ink-dark bg-white px-4 py-3.5 text-left"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-jua text-ink-dark"
                  style={{ backgroundColor: LEVEL_COLOR[j.level] }}
                >
                  Lv.{j.level}
                </span>
                <span className="text-[11px] text-muted">{formatDate(j.createdAt)}</span>
              </div>
              <p className="text-[12px] text-muted mb-1 line-clamp-1">{j.questionContent}</p>
              <p className="text-[13px] text-ink line-clamp-2 leading-relaxed">{j.content}</p>
            </Link>
          ))}
        </div>
      </WindowFrame>
    </div>
  );
}
