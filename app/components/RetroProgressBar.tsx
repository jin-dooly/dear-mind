// 블록 3개가 한 칸. 이 칸을 두 번 이어 붙여 절반만큼 밀면 끊김 없이 흐름
const BLOCKS_PER_PATTERN = 3;

/** 옛날 Windows 설치 창처럼 블록이 흘러가는 진행 바. 진행률은 알 수 없는 대기에 사용 */
export function RetroProgressBar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const height = size === 'sm' ? 'h-4' : 'h-6';
  const blocks = Array.from({ length: BLOCKS_PER_PATTERN * 2 });

  return (
    <div
      aria-hidden
      className={`w-full max-w-72 ${height} overflow-hidden rounded-md border-2 border-[#8B96C7] bg-white p-0.5`}
    >
      <div className="flex h-full w-[200%] animate-progress-slide motion-reduce:animate-none">
        {blocks.map((_, i) => (
          <div key={i} className="flex h-full flex-1 justify-center">
            <div className="h-full w-1/2 rounded-sm bg-linear-to-r from-[#A0B5EC] via-folder-purple-front to-folder-pink-front" />
          </div>
        ))}
      </div>
    </div>
  );
}
