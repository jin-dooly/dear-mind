'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { createJournal } from '@/app/lib/actions';
import type { Question } from '@/app/lib/types';

// 질문마다 따로 임시 저장. 이 기기(브라우저)에만 남고 글을 저장하면 지움
const draftKey = (questionId: string) => `dear-mind:draft:${questionId}`;

function readDraft(questionId: string) {
  try {
    return window.localStorage.getItem(draftKey(questionId)) ?? '';
  } catch {
    return '';
  }
}

function writeDraft(questionId: string, content: string) {
  try {
    if (content.trim()) window.localStorage.setItem(draftKey(questionId), content);
    else window.localStorage.removeItem(draftKey(questionId));
  } catch {
    // 저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 임시 저장 없이 진행
  }
}

/** ClientEditor를 통해 브라우저에서만 렌더링됨 (첫 렌더링부터 localStorage 사용) */
export function Editor({ question }: { question: Question }) {
  const router = useRouter();
  const [initialDraft] = useState(() => readDraft(question.id));
  const [content, setContent] = useState(initialDraft);
  const restored = initialDraft.length > 0;
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
      writeDraft(question.id, '');
      // 뒤로 가기로 에디터에 돌아와 같은 글을 다시 저장하지 않도록 replace
      router.replace(`/write/analysis/${journalId}`);
    } catch {
      setError('글을 저장하지 못했어요. 작성한 내용은 그대로 있으니 다시 시도해 주세요');
      setSubmitting(false);
    }
  }

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="EDITOR.EXE" closeHref="/write">
        <p className="text-[13px] text-ink leading-relaxed mb-4">{question.content}</p>

        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            writeDraft(question.id, e.target.value);
          }}
          placeholder="떠오르는 생각을 편하게 적어 보세요"
          className="w-full grow min-h-60 resize-none rounded-xl border-2 border-line-soft bg-white p-4 text-[13px] leading-relaxed text-ink outline-none focus:border-line"
        />
        <div className="flex justify-between gap-3 text-[11px] text-muted mt-1.5 mb-4">
          <span>{restored ? '임시 저장된 글을 불러왔어요' : '쓰는 내용은 이 기기에 임시 저장돼요'}</span>
          <span className="shrink-0">{content.length}자</span>
        </div>

        <ErrorMessage className="mb-3">{error}</ErrorMessage>
        <PrimaryButton onClick={handleSubmit} disabled={content.trim().length === 0 || submitting}>
          {submitting ? '저장 중...' : '저장하고 분석 보기'}
        </PrimaryButton>
      </WindowFrame>
    </div>
  );
}
