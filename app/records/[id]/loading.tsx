import { SkeletonBlock, WindowSkeleton } from '@/app/components/Skeleton';

export default function RecordDetailLoading() {
  return (
    <WindowSkeleton title="RECORD.TXT" closeHref="/records">
      <SkeletonBlock className="h-3 w-24 mb-2" />
      <SkeletonBlock className="h-3.5 w-full mb-4" />
      <div className="rounded-xl border-2 border-line-soft bg-white p-3.5 mb-5 flex flex-col gap-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-3/4" />
      </div>
      <SkeletonBlock className="h-24 w-24 rounded-full mx-auto mb-4" />
      <SkeletonBlock className="h-3 w-full mb-2" />
      <SkeletonBlock className="h-3 w-2/3" />
    </WindowSkeleton>
  );
}
