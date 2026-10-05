'use client';

import { useEffect, useState } from 'react';
import { AnalysisWaiting } from '@/app/components/AnalysisWaiting';
import { DitheredCat } from '@/app/components/DitheredCat';
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
    <AnalysisView seed={journalId} analysis={analysis} failed={failed} onRetry={retry} />
  );
}

/**
 * 분석 화면의 보이는 부분. 기다리는 동안엔 큰 고양이 + 안내 문구,
 * 결과가 나오면 같은 고양이가 작아지고 결과가 아래에서 살며시 떠오름
 */
function AnalysisView({
  seed,
  analysis,
  failed,
  onRetry,
}: {
  /** 고양이 색을 정하는 글 id */
  seed: string;
  analysis: AIAnalysis | null;
  failed: boolean;
  onRetry: () => void;
}) {
  return (
    <>
      <DitheredCat seed={seed} compact={Boolean(analysis)} />

      {!analysis ? (
        failed ? (
          <div className="mt-5 text-center">
            <p className="text-[13px] text-ink leading-relaxed">
              분석을 불러오지 못했어요. 글은 저장되어 있어요
            </p>
            <button onClick={onRetry} className="mt-2 text-[12px] text-muted underline">
              다시 분석하기
            </button>
          </div>
        ) : (
          <AnalysisWaiting />
        )
      ) : (
        <div className="animate-fade-up motion-reduce:animate-none">
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
                    className="rounded-full border border-line bg-folder-purple-front/40 px-2.5 py-1 text-[11px] font-jua text-folder-purple-text"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              <p className="text-[12px] text-ink leading-relaxed mt-4 rounded-xl bg-sky-light/60 p-3.5">
                {analysis.message}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
