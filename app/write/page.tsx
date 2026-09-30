import { WindowFrame } from '@/app/components/WindowFrame';
import { getOrCreateTodaysQuestions } from '@/app/lib/dailyQuestions';
import { QuestionList } from './QuestionList';

export default async function WritePage() {
  const { questions, refreshesLeft } = await getOrCreateTodaysQuestions();

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="TODAY'S QUESTIONS">
        <p className="text-[13px] text-muted mb-1">오늘의 질문 중 하나를 골라보세요</p>
        <h1 className="font-jua text-lg text-ink mb-6">무엇에 대해 써볼까요?</h1>

        <QuestionList questions={questions} refreshesLeft={refreshesLeft} />
      </WindowFrame>
    </div>
  );
}
