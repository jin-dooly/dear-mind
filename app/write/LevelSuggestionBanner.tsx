'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { dismissLevelSuggestion, saveProfile } from '@/app/lib/actions';
import type { LevelSuggestion } from '@/app/lib/levelSuggestion';

const LEVEL_LABEL: Record<number, string> = {
  1: '가볍게',
  2: '조금 더',
  3: '깊게',
  4: '아주 깊게',
};

export function LevelSuggestionBanner({ suggestion }: { suggestion: LevelSuggestion }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const deeper = suggestion.to > suggestion.from;

  function respond(accept: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        if (accept) await saveProfile({ baseLevel: suggestion.to });
        else await dismissLevelSuggestion();
        router.refresh();
      } catch {
        setError('저장하지 못했어요. 잠시 후 다시 시도해주세요');
      }
    });
  }

  return (
    <div className="rounded-xl border-2 border-ink-dark bg-sky-light/60 p-3.5 mb-5">
      <p className="text-[12px] text-ink leading-relaxed">
        요즘 {deeper ? '더 깊은' : '더 가벼운'} 질문을 자주 고르셨네요.
        <br />
        기본 레벨을{' '}
        <span className="font-jua">
          Lv.{suggestion.to} {LEVEL_LABEL[suggestion.to]}
        </span>
        로 바꿀까요?
      </p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => respond(true)}
          disabled={pending}
          className="rounded-full border-2 border-ink-dark bg-folder-purple-back px-3 py-1 text-[12px] font-jua text-white disabled:opacity-60"
        >
          바꾸기
        </button>
        <button
          onClick={() => respond(false)}
          disabled={pending}
          className="rounded-full border-2 border-[#C7CDEB] bg-white px-3 py-1 text-[12px] font-jua text-muted disabled:opacity-60"
        >
          지금이 좋아요
        </button>
      </div>
      <ErrorMessage className="mt-2">{error}</ErrorMessage>
    </div>
  );
}
