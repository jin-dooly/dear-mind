import type { ComponentProps, ReactNode } from 'react';
import { WindowFrame } from '@/app/components/WindowFrame';

/** 글자·카드 자리를 대신하는 은은하게 반짝이는 막대 */
export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-md bg-skeleton animate-pulse motion-reduce:animate-none ${className}`} />
  );
}

/** 카드 모양 스켈레톤 (질문·기록 카드와 같은 틀) */
export function SkeletonCard({ children }: { children?: ReactNode }) {
  return (
    <div className="w-full rounded-xl border-2 border-line-soft bg-white px-4 py-3.5 flex flex-col gap-2">
      {children ?? (
        <>
          <SkeletonBlock className="h-3.5 w-12 rounded-full" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-2/3" />
        </>
      )}
    </div>
  );
}

/**
 * 창 프레임은 실제 제목으로 바로 보여주고 안쪽만 스켈레톤으로 채우는 페이지 로딩 틀.
 * 데이터가 도착해도 레이아웃이 튀지 않게 실제 페이지와 같은 바깥 구조를 씀
 */
export function WindowSkeleton({
  title,
  size,
  closeHref,
  children,
}: {
  title: string;
  size: ComponentProps<typeof WindowFrame>['size'];
  closeHref?: string;
  children: ReactNode;
}) {
  return (
    <div className="p-7 flex flex-col h-dvh items-center justify-center">
      <WindowFrame title={title} size={size} closeHref={closeHref}>
        <div role="status" aria-label="불러오는 중" className="flex flex-col grow">
          {children}
        </div>
      </WindowFrame>
    </div>
  );
}

/** 화면 상단의 작은 안내 + 제목 자리 */
export function SkeletonHeading() {
  return (
    <>
      <SkeletonBlock className="h-3 w-40 mb-2" />
      <SkeletonBlock className="h-5 w-28 mb-6" />
    </>
  );
}
