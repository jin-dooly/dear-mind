import Link from 'next/link';
import { WindowFrame } from '@/app/components/WindowFrame';
import { AnalysisResult } from '@/app/components/AnalysisResult';
import { getJournal } from '@/app/lib/db';
import { GoHomeButton } from './GoHomeButton';

export default async function AnalysisPage({ params }: { params: Promise<{ journalId: string }> }) {
  const { journalId } = await params;
  const journal = await getJournal(journalId);

  if (!journal) {
    return (
      <div className="p-7 flex flex-col min-h-screen">
        <WindowFrame title="ANALYSIS.EXE" closeHref="/home">
          <p className="text-[13px] text-muted text-center mt-10">기록을 찾을 수 없어요</p>
          <Link href="/home" className="text-[12px] text-ink underline mt-4 text-center">
            홈으로 돌아가기
          </Link>
        </WindowFrame>
      </div>
    );
  }

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="ANALYSIS.EXE" closeHref="/home">
        <AnalysisResult journalId={journal.id} initialAnalysis={journal.analysis} />

        <div className="grow" />
        <GoHomeButton />
        <Link href="/records" className="mt-3 text-[12px] text-muted underline self-center">
          지난 기록 보기
        </Link>
      </WindowFrame>
    </div>
  );
}
