import { WindowFrame } from '@/app/components/WindowFrame';
import { getOrCreateTodaysQuestions } from '@/app/lib/dailyQuestions';
import { getLevelSuggestion } from '@/app/lib/levelSuggestion';
import { LevelSuggestionBanner } from './LevelSuggestionBanner';
import { QuestionList } from './QuestionList';

export default async function WritePage() {
  const [{ sets, refreshesLeft }, suggestion] = await Promise.all([
    getOrCreateTodaysQuestions(),
    getLevelSuggestion(),
  ]);

  return (
    <div className="p-7 flex flex-col min-h-screen items-center justify-center">
      <WindowFrame title="QUESTIONS.EXE" size="md" closeHref="/home">
        <p className="text-[13px] text-muted mb-1">오늘의 질문 중 하나를 골라 보세요</p>
        <h1 className="font-jua text-lg text-ink mb-6">무엇에 대해 써 볼까요?</h1>

        {suggestion && <LevelSuggestionBanner suggestion={suggestion} />}
        <QuestionList sets={sets} refreshesLeft={refreshesLeft} />
      </WindowFrame>
    </div>
  );
}
