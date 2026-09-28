import type { ButtonHTMLAttributes } from 'react';

export function PrimaryButton({
  className = '',
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      className={`w-full rounded-xl border-2 border-ink-dark px-5 py-3 font-jua text-[14px] text-white shadow-[0_4px_0_var(--color-ink-dark)] transition-transform active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:pointer-events-none ${className}`}
      style={{ backgroundColor: '#8B6FBE' }}
      {...props}
    />
  );
}
