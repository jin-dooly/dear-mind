'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { refreshQuestions } from '@/app/lib/actions';
import type { Question } from '@/app/lib/types';

const LEVEL_COLOR: Record<number, string> = {
  1: '#DCEFFB',
  2: '#E3E3FB',
  3: '#F0D9F5',
  4: '#C9B8EA',
};

export function QuestionList({
  questions,
  refreshesLeft,
}: {
  questions: Question[];
  refreshesLeft: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRefresh() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await refreshQuestions();
        if (result.error) setError(result.error);
        else router.refresh();
      } catch {
        setError('질문을 새로 받지 못했어요. 잠시 후 다시 시도해주세요');
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q) => (
        <Link
          key={q.id}
          href={`/write/${q.id}`}
          aria-disabled={pending}
          className={`w-full rounded-xl border-2 border-ink-dark bg-white px-4 py-3.5 text-left transition-transform active:translate-y-0.5 ${
            pending ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-jua text-ink-dark mb-2"
            style={{ backgroundColor: LEVEL_COLOR[q.level] }}
          >
            Lv.{q.level}
          </span>
          <span className="block text-[13px] text-ink leading-relaxed">{q.content}</span>
        </Link>
      ))}

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
