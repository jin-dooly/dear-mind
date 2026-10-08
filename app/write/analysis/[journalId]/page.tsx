import { notFound } from 'next/navigation';
import Link from 'next/link';
import { WindowFrame } from '@/app/components/WindowFrame';
import { AnalysisResult } from '@/app/components/AnalysisResult';
import { getJournal } from '@/app/lib/db';
import { GoHomeButton } from './GoHomeButton';

export default async function AnalysisPage({ params }: { params: Promise<{ journalId: string }> }) {
  const { journalId } = await params;
  const journal = await getJournal(journalId);

  if (!journal) notFound();

  return (
    <div className="p-7 flex flex-col h-dvh items-center justify-center">
      <WindowFrame title="ANALYSIS.EXE" size="md" closeHref="/home">
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
