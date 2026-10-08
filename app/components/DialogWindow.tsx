import type { ReactNode } from 'react';
import { WindowFrame } from '@/app/components/WindowFrame';

/** 옛날 Windows 경고 대화상자처럼 화면 가운데 작게 뜨는 창 (에러, 404 등) */
export function DialogWindow({
  title,
  icon,
  heading,
  description,
  children,
}: {
  title: string;
  icon: ReactNode;
  heading: string;
  description: string;
  /** 버튼 영역 */
  children: ReactNode;
}) {
  return (
    <div className="p-7 flex flex-col h-dvh items-center justify-center">
      <WindowFrame title={title} size="sm" className="h-fit grow-0">
        <div className="flex flex-col items-center text-center px-2 py-6">
          <div className="text-[#9FB4EA] mb-4" aria-hidden>
            {icon}
          </div>
          <h1 className="font-jua text-lg text-ink mb-1.5">{heading}</h1>
          <p className="text-[13px] text-muted leading-relaxed mb-6 whitespace-pre-line">{description}</p>
          <div className="w-full flex flex-col items-center gap-3">{children}</div>
        </div>
      </WindowFrame>
    </div>
  );
}
