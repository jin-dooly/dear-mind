'use client';

import { useEffect, useState } from 'react';
import { CompanionBlob } from '@/app/components/CompanionBlob';
import { analyzeAndSaveJournal } from '@/app/lib/actions';
import type { AIAnalysis } from '@/app/lib/types';

/** 분석 결과를 보여주고, 아직 분석이 없으면 분석을 요청해 저장까지 한다 */
export function AnalysisResult({
  journalId,
  initialAnalysis,
}: {
  journalId: string;
  initialAnalysis: AIAnalysis | null;
}) {
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (analysis) return;
    let cancelled = false;
    analyzeAndSaveJournal(journalId)
      .then((result) => {
        if (!cancelled) setAnalysis(result);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [analysis, journalId, attempt]);

  function retry() {
    setFailed(false);
    setAttempt((n) => n + 1);
  }

  return (
    <>
      <CompanionBlob />

      {!analysis ? (
        failed ? (
          <div className="mt-5 text-center">
            <p className="text-[13px] text-ink leading-relaxed">
              분석을 불러오지 못했어요. 글은 저장되어 있어요
            </p>
            <button onClick={retry} className="mt-2 text-[12px] text-muted underline">
              다시 분석하기
            </button>
          </div>
        ) : (
          <p className="text-[13px] text-muted leading-relaxed mt-5 text-center">
            AI가 글을 읽고 있어요...
          </p>
        )
      ) : analysis.isSafetyFallback ? (
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
    </>
  );
}
