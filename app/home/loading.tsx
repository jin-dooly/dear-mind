import { WindowFrame } from '@/app/components/WindowFrame';
import { SkeletonBlock } from '@/app/components/Skeleton';

// 홈은 가운데 정렬된 좁은 창이라 WindowSkeleton 대신 실제 홈과 같은 틀을 씀
export default function HomeLoading() {
  return (
    <div className="p-7 flex flex-col min-h-screen items-center justify-center">
      <WindowFrame title="HOME.EXE" className="w-fit h-fit grow-0">
        <div role="status" aria-label="불러오는 중" className="p-2 pb-4 w-[287px] max-w-full">
          <SkeletonBlock className="h-6 w-44 mb-2" />
          <SkeletonBlock className="h-3.5 w-36 mb-5" />
          <div className="flex flex-col gap-5">
            {[0, 1, 2].map((i) => (
              <SkeletonBlock key={i} className="h-[88px] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}
