import { SkeletonBlock, WindowSkeleton } from '@/app/components/Skeleton';

export function EditorSkeleton() {
  return (
    <WindowSkeleton title="EDITOR.EXE" closeHref="/write">
      <SkeletonBlock className="h-3.5 w-full mb-2" />
      <SkeletonBlock className="h-3.5 w-1/2 mb-4" />
      <div className="w-full grow min-h-60 rounded-xl border-2 border-line-soft bg-white" />
      <SkeletonBlock className="h-12 w-full mt-9 rounded-xl" />
    </WindowSkeleton>
  );
}
