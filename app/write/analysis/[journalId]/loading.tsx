import { WindowFrame } from '@/app/components/WindowFrame';
import { CompanionBlob } from '@/app/components/CompanionBlob';
import { AnalysisWaiting } from '@/app/components/AnalysisWaiting';

// 분석 화면으로 넘어가는 순간부터 같은 대기 화면을 보여줘서, 페이지가 뜬 뒤 분석을 기다릴 때와 끊김 없이 이어짐
export default function AnalysisLoading() {
  return (
    <div className="p-7 flex flex-col min-h-screen items-center justify-center">
      <WindowFrame title="ANALYSIS.EXE" size="md" closeHref="/home">
        <CompanionBlob animated />
        <AnalysisWaiting />
      </WindowFrame>
    </div>
  );
}
