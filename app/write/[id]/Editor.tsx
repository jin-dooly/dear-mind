'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { createJournal } from '@/app/lib/actions';
import type { Question } from '@/app/lib/types';

export function Editor({ question }: { question: Question }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (content.trim().length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const journalId = await createJournal({
        questionId: question.id,
        questionContent: question.content,
        level: question.level,
        content,
      });
      // 뒤로 가기로 에디터에 돌아와 같은 글을 다시 저장하지 않도록 replace
      router.replace(`/write/analysis/${journalId}`);
    } catch {
      setError('글을 저장하지 못했어요. 작성한 내용은 그대로 있으니 다시 시도해주세요');
      setSubmitting(false);
    }
  }

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="EDITOR" closeHref="/write">
        <p className="text-[13px] text-ink leading-relaxed mb-4">{question.content}</p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="떠오르는 생각을 편하게 적어보세요"
          className="w-full grow min-h-[240px] resize-none rounded-xl border-2 border-[#C7CDEB] bg-white p-4 text-[13px] leading-relaxed text-ink outline-none focus:border-ink-dark"
        />
        <p className="text-[11px] text-muted text-right mt-1.5 mb-4">{content.length}자</p>

        <ErrorMessage className="mb-3">{error}</ErrorMessage>
        <PrimaryButton onClick={handleSubmit} disabled={content.trim().length === 0 || submitting}>
          {submitting ? '저장 중...' : '저장하기'}
        </PrimaryButton>
      </WindowFrame>
    </div>
  );
}
