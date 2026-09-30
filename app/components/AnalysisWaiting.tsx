import { RotatingMessage } from '@/app/components/RotatingMessage';

/** AI 분석을 기다리는 동안 블롭 아래에 보여주는 점 3개 + 안내 문구. 5초가 넘으면 문구가 바뀜 */
export function AnalysisWaiting() {
  return (
    <div className="mt-3 flex flex-col items-center gap-3">
      <div aria-hidden className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink animate-dot motion-reduce:animate-none"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <RotatingMessage
        messages={['AI가 글을 읽고 있어요', '조금만 더 기다려 주세요']}
        intervalMs={5000}
        className="text-[13px] text-muted leading-relaxed"
      />
    </div>
  );
}
