'use client';

import { use } from 'react';
import Link from 'next/link';
import { WindowFrame } from '@/app/components/WindowFrame';
import { CompanionBlob } from '@/app/components/CompanionBlob';
import { useHasMounted } from '@/app/lib/useHasMounted';
import { getJournal } from '@/app/lib/storage';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hasMounted = useHasMounted();
  const journal = hasMounted ? getJournal(id) : undefined;

  if (!journal) {
    return (
      <div className="p-7 flex flex-col min-h-screen">
        <WindowFrame title="RECORD">
          <p className="text-[13px] text-muted text-center mt-10">기록을 찾을 수 없어요</p>
          <Link href="/records" className="text-[12px] text-ink underline mt-4 text-center">
            목록으로 돌아가기
          </Link>
        </WindowFrame>
      </div>
    );
  }

  const { analysis } = journal;

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title={`RECORD · ${formatDate(journal.createdAt)}`}>
        <span className="text-[11px] text-muted mb-1">Lv.{journal.level} · 오늘의 질문</span>
        <p className="text-[13px] text-ink leading-relaxed mb-4">{journal.questionContent}</p>

        <p className="text-[13px] text-ink leading-relaxed mb-5 rounded-xl bg-white border-2 border-[#C7CDEB] p-3.5 whitespace-pre-line">
          {journal.content}
        </p>

        <CompanionBlob />

        {analysis.isSafetyFallback ? (
          <p className="text-[13px] text-ink leading-relaxed mt-5 whitespace-pre-line text-center">
            {analysis.message}
          </p>
        ) : (
          <>
            <p className="text-[13px] text-ink leading-relaxed mt-5">{analysis.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {analysis.toneKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-folder-purple-back bg-folder-purple-front/40 px-2.5 py-1 text-[11px] font-jua text-folder-purple-text"
                >
                  #{kw}
                </span>
              ))}
            </div>
            <p className="text-[12px] text-muted leading-relaxed mt-4 rounded-xl bg-sky-light/60 p-3.5">
              {analysis.message}
            </p>
          </>
        )}
      </WindowFrame>
    </div>
  );
}
