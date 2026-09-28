'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { CompanionBlob } from '@/app/components/CompanionBlob';
import { useHasMounted } from '@/app/lib/useHasMounted';
import { addJournal, clearWriteSession, getPendingJournal } from '@/app/lib/storage';

export default function AnalysisPage() {
  const router = useRouter();
  const hasMounted = useHasMounted();
  const journal = hasMounted ? getPendingJournal() : null;
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hasMounted) return;
    if (!journal) router.replace('/write');
  }, [hasMounted, journal, router]);

  function handleSave() {
    if (!journal) return;
    setSaving(true);
    addJournal(journal);
    clearWriteSession();
    router.push('/home');
  }

  if (!journal) return null;
  const { analysis } = journal;

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="AI ANALYSIS">
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

        <div className="grow" />
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '기록 저장하기'}
        </PrimaryButton>
      </WindowFrame>
    </div>
  );
}
