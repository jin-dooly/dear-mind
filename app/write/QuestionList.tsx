'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuestion } from '@/app/lib/actions';
import { setSelectedQuestion } from '@/app/lib/storage';
import type { Question } from '@/app/lib/types';

const LEVEL_COLOR: Record<number, string> = {
  1: '#DCEFFB',
  2: '#E3E3FB',
  3: '#F0D9F5',
  4: '#C9B8EA',
};

export function QuestionList({ questions }: { questions: Question[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function selectQuestion({ content, level, type }: Question) {
    setPending(true);
    try {
      const saved = await createQuestion({ content, level, type });
      setSelectedQuestion(saved);
      router.push(`/write/${saved.id}`);
    } catch {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q) => (
        <button
          key={q.id}
          onClick={() => selectQuestion(q)}
          disabled={pending}
          className="w-full rounded-xl border-2 border-ink-dark bg-white px-4 py-3.5 text-left transition-transform active:translate-y-0.5 disabled:opacity-60"
        >
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-jua text-ink-dark mb-2"
            style={{ backgroundColor: LEVEL_COLOR[q.level] }}
          >
            Lv.{q.level}
          </span>
          <span className="block text-[13px] text-ink leading-relaxed">{q.content}</span>
        </button>
      ))}
    </div>
  );
}
