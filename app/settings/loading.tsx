import { SkeletonBlock, SkeletonHeading, WindowSkeleton } from '@/app/components/Skeleton';

export default function SettingsLoading() {
  return (
    <WindowSkeleton title="MY-INFO.EXE" closeHref="/home">
      <SkeletonHeading />
      <SkeletonBlock className="h-3 w-12 mb-2" />
      <div className="flex gap-2 mb-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <SkeletonBlock key={i} className="h-7 w-14 rounded-full" />
        ))}
      </div>
      <SkeletonBlock className="h-3 w-16 mb-2" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} className="h-11 w-full rounded-xl" />
        ))}
      </div>
    </WindowSkeleton>
  );
}
