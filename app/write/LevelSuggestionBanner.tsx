'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { PRIMARY_SURFACE_CLASS } from '@/app/components/PrimaryButton';
import { dismissLevelSuggestion, saveProfile } from '@/app/lib/actions';
import type { LevelSuggestion } from '@/app/lib/levelSuggestion';
import { LEVEL_INFO, levelLabel } from '@/app/lib/levels';

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
        setError('저장하지 못했어요. 잠시 후 다시 시도해 주세요');
      }
    });
  }

  return (
    <div className="rounded-xl border-2 border-line bg-sky-light/60 p-3.5 mb-5">
      <p className="text-[12px] text-ink leading-relaxed">
        요즘 {deeper ? '더 깊은' : '더 가벼운'} 질문을 자주 고르셨네요.
        <br />
        기본 레벨을 한 단계 {deeper ? '올려' : '내려'}{' '}
        <span className="font-jua">Lv.{suggestion.to}</span>
        {/* 숫자를 읽는 소리 기준: 일·이·사 → 로, 삼 → 으로 */}
        {suggestion.to === 3 ? '으로' : '로'} 바꿀까요?
      </p>
      <p className="text-[11px] text-muted mt-1">
        {levelLabel(suggestion.to)} · {LEVEL_INFO[suggestion.to].description}
      </p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => respond(true)}
          disabled={pending}
          className={`rounded-full px-3 py-1 text-[12px] ${PRIMARY_SURFACE_CLASS} disabled:opacity-60`}
        >
          바꾸기
        </button>
        <button
          onClick={() => respond(false)}
          disabled={pending}
          className="rounded-full border-2 border-line-soft bg-white px-3 py-1 text-[12px] font-jua text-muted disabled:opacity-60"
        >
          지금이 좋아요
        </button>
      </div>
      <ErrorMessage className="mt-2">{error}</ErrorMessage>
    </div>
  );
}
