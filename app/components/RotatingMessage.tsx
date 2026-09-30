'use client';

import { useEffect, useState } from 'react';

/** 문구를 차례로 바꿔 보여주고 마지막 문구에서 멈춤. 화면 낭독기에도 읽힘 */
export function RotatingMessage({
  messages,
  intervalMs = 2500,
  className = '',
}: {
  messages: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= messages.length - 1) return;
    const timer = setTimeout(() => setIndex((i) => i + 1), intervalMs);
    return () => clearTimeout(timer);
  }, [index, messages.length, intervalMs]);

  return (
    <p role="status" aria-live="polite" className={`whitespace-pre-line text-center ${className}`}>
      {messages[index]}
    </p>
  );
}
