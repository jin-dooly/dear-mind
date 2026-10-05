import { SkeletonCard, SkeletonHeading, WindowSkeleton } from '@/app/components/Skeleton';

export default function RecordsLoading() {
  return (
    <WindowSkeleton title="RECORDS.EXE" size="lg" closeHref="/home">
      <SkeletonHeading />
      <div className="flex flex-col gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </WindowSkeleton>
  );
}
