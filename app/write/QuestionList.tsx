'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { LevelBadge } from '@/app/components/LevelBadge';
import { RetroProgressBar } from '@/app/components/RetroProgressBar';
import { refreshQuestions } from '@/app/lib/actions';
import type { Question } from '@/app/lib/types';

export function QuestionList({
  sets,
  refreshesLeft,
}: {
  sets: Question[][];
  refreshesLeft: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // null이면 가장 최근 세트를 보여줌. 새 세트를 받으면 자동으로 그 세트로 이동
  const [viewedIndex, setViewedIndex] = useState<number | null>(null);

  const latestIndex = sets.length - 1;
  const index = viewedIndex ?? latestIndex;
  const isLatest = index === latestIndex;

  function handleRefresh() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await refreshQuestions();
        if (result.error) {
          setError(result.error);
        } else {
          setViewedIndex(null);
          router.refresh();
        }
      } catch {
        setError('질문을 새로 받지 못했어요. 잠시 후 다시 시도해 주세요');
      }
    });
  }

  function showSet(next: number) {
    // 최근 세트로 돌아오면 null로 되돌려, 이후 새 세트를 받았을 때 따라가게 함
    setViewedIndex(next === latestIndex ? null : next);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 새 질문을 받는 동안 카드는 흐리게 두고 그 위에 진행 바를 띄움 */}
      <div className="relative flex flex-col gap-3">
        {sets[index].map((q) => (
          <Link
            key={q.id}
            href={`/write/${q.id}`}
            aria-disabled={pending}
            tabIndex={pending ? -1 : undefined}
            className={`w-full rounded-xl border-2 border-ink-dark bg-white px-4 py-3.5 text-left transition-[transform,opacity] active:translate-y-0.5 ${
              pending ? 'pointer-events-none opacity-30' : ''
            }`}
          >
            <LevelBadge level={q.level} className="mb-2" />
            <span className="block text-[13px] text-ink leading-relaxed">{q.content}</span>
          </Link>
        ))}
        {pending && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <p role="status" className="font-jua text-[13px] text-ink">
              새 질문을 고르고 있어요
            </p>
            <RetroProgressBar size="sm" />
          </div>
        )}
      </div>

      {sets.length > 1 && (
        <nav aria-label="오늘 받은 질문 세트" className="flex items-center justify-center gap-3 mt-1">
          <button
            onClick={() => showSet(index - 1)}
            disabled={index === 0}
            aria-label="이전 질문 세트"
            className="text-ink disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {sets.map((_, i) => (
              <button
                key={i}
                onClick={() => showSet(i)}
                aria-label={`${i + 1}번째 질문 세트`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full border border-ink-dark ${
                  i === index ? 'bg-ink-dark' : 'bg-white'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => showSet(index + 1)}
            disabled={isLatest}
            aria-label="다음 질문 세트"
            className="text-ink disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      )}

      <button
        onClick={handleRefresh}
        disabled={pending || refreshesLeft === 0}
        className="mt-1 flex items-center justify-center gap-1.5 self-center text-[12px] text-muted underline disabled:no-underline disabled:opacity-60"
      >
        <RefreshCw size={12} className={pending ? 'animate-spin' : ''} />
        {refreshesLeft === 0
          ? '오늘은 새 질문을 모두 받았어요'
          : `다른 질문 받기 (${refreshesLeft}번 남음)`}
      </button>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
