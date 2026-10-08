import { WindowFrame } from '@/app/components/WindowFrame';
import { AnalysisWaiting } from '@/app/components/AnalysisWaiting';
import { LoadingCat } from './LoadingCat';

// 분석 화면으로 넘어가는 순간부터 같은 대기 화면을 보여줘서, 페이지가 뜬 뒤 분석을 기다릴 때와 끊김 없이 이어짐
// (고양이 색은 글 id로 정해져서 분석 화면과 같음)
export default function AnalysisLoading() {
  return (
    <div className="p-7 flex flex-col h-dvh items-center justify-center">
      <WindowFrame title="ANALYSIS.EXE" size="md" closeHref="/home">
        <LoadingCat />
        <AnalysisWaiting />
      </WindowFrame>
    </div>
  );
}
