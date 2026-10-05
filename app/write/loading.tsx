import { WindowFrame } from '@/app/components/WindowFrame';
import { RetroProgressBar } from '@/app/components/RetroProgressBar';
import { RotatingMessage } from '@/app/components/RotatingMessage';

// 질문 생성(LLM)은 몇 초 걸릴 수 있어 진행 바 + 바뀌는 문구로 기다림을 보여줌
const MESSAGES = [
  '지금의 나에게 맞는 질문을\n고르고 있어요',
  '어느 정도 깊이가 좋을지\n살펴보는 중이에요',
  '거의 다 됐어요',
];

export default function QuestionsLoading() {
  return (
    <div className="p-7 flex flex-col min-h-screen items-center justify-center">
      <WindowFrame title="QUESTIONS.EXE" size="md" closeHref="/home">
        <div className="flex flex-col grow items-center justify-center gap-6 py-10">
          <RotatingMessage messages={MESSAGES} className="font-jua text-[15px] text-ink leading-relaxed" />
          <RetroProgressBar />
        </div>
      </WindowFrame>
    </div>
  );
}
