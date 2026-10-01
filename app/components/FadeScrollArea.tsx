'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * 스크롤바를 숨긴 스크롤 영역. 아래에 내용이 더 있을 때만 바닥에 옅은 그라데이션을 깔아
 * "더 있음"을 알려주고, 끝까지 내리면 그라데이션이 사라짐
 */
export function FadeScrollArea({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setHasMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 처음 그려질 때와 창 크기가 바뀔 때 다시 확인 (관찰을 시작하면 콜백이 한 번 바로 불림)
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  return (
    <div className="relative flex flex-col grow min-h-0">
      <div ref={ref} onScroll={update} className={`window-scroll grow min-h-0 overflow-y-auto ${className}`}>
        {children}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-transparent to-[#FBFAFF] transition-opacity duration-200 ${
          hasMore ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
