import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import Link from 'next/link';

/**
 * primary 버튼 겉모습 (로그인 버튼과 같은 하늘색 스타일).
 * 크기·모서리는 쓰는 곳에서 정함 (로그인 버튼, 레벨 제안의 작은 버튼 등에서도 사용)
 */
export const PRIMARY_SURFACE_CLASS =
  'border-2 border-line bg-primary font-jua text-ink-dark transition-transform active:translate-y-0.5';

const PRIMARY_CLASS = `w-full rounded-xl px-5 py-3.5 text-[15px] text-center ${PRIMARY_SURFACE_CLASS}`;

export function PrimaryButton({
  className = '',
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      className={`${PRIMARY_CLASS} disabled:opacity-40 disabled:pointer-events-none ${className}`}
      {...props}
    />
  );
}

/** PrimaryButton과 같은 모양의 페이지 이동 링크 */
export function PrimaryLink({ className = '', ...props }: ComponentProps<typeof Link>) {
  return <Link className={`${PRIMARY_CLASS} ${className}`} {...props} />;
}
