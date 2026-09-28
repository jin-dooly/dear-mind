'use client';

import { useRouter } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { useHasMounted } from '@/app/lib/useHasMounted';
import { getTodaysQuestions, recommendLevel } from '@/app/lib/questions';
import { DEFAULT_PROFILE, getJournals, getProfile, setSelectedQuestion } from '@/app/lib/storage';
import type { Question } from '@/app/lib/types';

const LEVEL_COLOR: Record<number, string> = {
  1: '#DCEFFB',
  2: '#E3E3FB',
  3: '#F0D9F5',
  4: '#C9B8EA',
};

export default function WritePage() {
  const router = useRouter();
  const hasMounted = useHasMounted();
  const profile = hasMounted ? getProfile() : DEFAULT_PROFILE;
  const journals = hasMounted ? getJournals() : [];

  const level = recommendLevel(journals, profile.baseLevel);
  const today = new Date().toISOString().slice(0, 10);
  const questions = getTodaysQuestions(level, today);

  function selectQuestion(question: Question) {
    setSelectedQuestion(question);
    router.push(`/write/${question.id}`);
  }

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="TODAY'S QUESTIONS">
        <p className="text-[13px] text-muted mb-1">오늘의 질문 중 하나를 골라보세요</p>
        <h1 className="font-jua text-lg text-ink mb-6">무엇에 대해 써볼까요?</h1>

        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => selectQuestion(q)}
              className="w-full rounded-xl border-2 border-ink-dark bg-white px-4 py-3.5 text-left transition-transform active:translate-y-0.5"
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
      </WindowFrame>
    </div>
  );
}
