import type { ReactNode } from 'react';

export function ChoiceButton({
  label,
  description,
  selected,
  onClick,
  selectedClassName = 'bg-sky-light',
}: {
  label: ReactNode;
  description?: string;
  selected: boolean;
  onClick: () => void;
  /** 선택됐을 때 배경 클래스 (예: levelBgClass(3)) */
  selectedClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-colors ${
        selected ? `border-line ${selectedClassName}` : 'border-line-soft bg-white'
      }`}
    >
      <span className={`block font-jua text-[14px] ${selected ? 'text-ink-dark' : 'text-ink'}`}>{label}</span>
      {description && <span className="block text-[11px] text-muted mt-0.5">{description}</span>}
    </button>
  );
}
