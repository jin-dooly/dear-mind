import type { ReactNode } from 'react';

export function ChoiceButton({
  label,
  description,
  selected,
  onClick,
  accentColor,
}: {
  label: ReactNode;
  description?: string;
  selected: boolean;
  onClick: () => void;
  accentColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-colors ${
        selected ? 'border-ink-dark' : 'border-[#C7CDEB] bg-white'
      }`}
      style={selected ? { backgroundColor: accentColor ?? '#DCE9FB' } : undefined}
    >
      <span className="block font-jua text-[14px] text-ink">{label}</span>
      {description && <span className="block text-[11px] text-muted mt-0.5">{description}</span>}
    </button>
  );
}
