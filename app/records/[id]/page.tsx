import { notFound } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { AnalysisResult } from '@/app/components/AnalysisResult';
import { getJournal } from '@/app/lib/db';
import { formatDate, isTodayKST } from '@/app/lib/format';
import { levelLabel } from '@/app/lib/levels';

export default async function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const journal = await getJournal(id);

  if (!journal) notFound();

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title={`${formatDate(journal.createdAt)}.TXT`} closeHref="/records">
        <span className="text-[11px] text-muted mb-1">
          {levelLabel(journal.level)} · {isTodayKST(journal.createdAt) ? '오늘의 질문' : '그날의 질문'}
        </span>
        <p className="text-[13px] text-ink leading-relaxed mb-4">{journal.questionContent}</p>

        <p className="text-[13px] text-ink leading-relaxed mb-5 rounded-xl bg-white border-2 border-line-soft p-3.5 whitespace-pre-line">
          {journal.content}
        </p>

        <AnalysisResult journalId={journal.id} initialAnalysis={journal.analysis} />
      </WindowFrame>
    </div>
  );
}
