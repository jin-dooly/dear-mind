import { notFound } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { AnalysisResult } from '@/app/components/AnalysisResult';
import { getJournal } from '@/app/lib/db';
import { formatDate, isTodayKST } from '@/app/lib/format';
import { levelLabel } from '@/app/lib/levels';
import { parseRecordsQuery, recordsQueryString } from '../recordsQuery';

export default async function RecordDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const journal = await getJournal(id);
  // 캘린더에서 들어왔으면 닫을 때 보던 달·날짜로 돌아감
  const closeHref = `/records${recordsQueryString(parseRecordsQuery(query))}`;

  if (!journal) notFound();

  return (
    <div className="p-7 flex flex-col h-dvh items-center justify-center">
      <WindowFrame title={`${formatDate(journal.createdAt)}.TXT`} size="lg" closeHref={closeHref}>
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
