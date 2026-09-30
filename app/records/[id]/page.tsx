import Link from 'next/link';
import { WindowFrame } from '@/app/components/WindowFrame';
import { AnalysisResult } from '@/app/components/AnalysisResult';
import { getJournal } from '@/app/lib/db';
import { formatDate } from '@/app/lib/format';

export default async function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const journal = await getJournal(id);

  if (!journal) {
    return (
      <div className="p-7 flex flex-col min-h-screen">
        <WindowFrame title="RECORD" closeHref="/records">
          <p className="text-[13px] text-muted text-center mt-10">기록을 찾을 수 없어요</p>
          <Link href="/records" className="text-[12px] text-ink underline mt-4 text-center">
            목록으로 돌아가기
          </Link>
        </WindowFrame>
      </div>
    );
  }

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title={`RECORD · ${formatDate(journal.createdAt)}`} closeHref="/records">
        <span className="text-[11px] text-muted mb-1">Lv.{journal.level} · 오늘의 질문</span>
        <p className="text-[13px] text-ink leading-relaxed mb-4">{journal.questionContent}</p>

        <p className="text-[13px] text-ink leading-relaxed mb-5 rounded-xl bg-white border-2 border-[#C7CDEB] p-3.5 whitespace-pre-line">
          {journal.content}
        </p>

        <AnalysisResult journalId={journal.id} initialAnalysis={journal.analysis} />
      </WindowFrame>
    </div>
  );
}
