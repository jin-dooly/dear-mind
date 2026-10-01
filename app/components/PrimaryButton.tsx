import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import Link from 'next/link';

const PRIMARY_CLASS =
  'w-full rounded-xl border-2 border-ink-dark bg-folder-purple-back px-5 py-3 font-jua text-[14px] text-white text-center shadow-[0_4px_0_var(--color-ink-dark)] transition-transform active:translate-y-1 active:shadow-none';

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
