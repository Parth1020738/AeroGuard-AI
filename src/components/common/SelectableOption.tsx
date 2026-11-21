import React from 'react';
import { Check } from 'lucide-react';

export interface SelectableOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
  description?: string;
  badge?: string | React.ReactNode;
  role?: 'checkbox' | 'radio' | 'button';
  disabled?: boolean;
  className?: string;
}

function OptionIndicator({ isCheckbox, selected }: { isCheckbox: boolean; selected: boolean }): React.JSX.Element | null {
  if (!isCheckbox) return null;
  return (
    <div
      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
        selected ? 'bg-teal-700 border-teal-700 text-white' : 'border-slate-300 bg-white'
      }`}
    >
      {selected && <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />}
    </div>
  );
}

export function SelectableOption({
  label,
  selected,
  onSelect,
  icon,
  description,
  badge,
  role = 'button',
  disabled = false,
  className = '',
}: SelectableOptionProps): React.JSX.Element {
  const isCheckOrRadio = role === 'checkbox' || role === 'radio';
  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <button
      type="button"
      role={role}
      disabled={disabled}
      aria-checked={isCheckOrRadio ? selected : undefined}
      aria-pressed={role === 'button' ? selected : undefined}
      onClick={onSelect}
      onKeyDown={handleKey}
      className={`p-3 text-left rounded-xl border transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:opacity-50 ${
        selected ? 'border-teal-700 bg-teal-50/80 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
      } ${className}`}
    >
      <div className="flex items-center justify-between font-semibold text-slate-900 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {icon}
          <span className="truncate">{label}</span>
        </div>
        {typeof badge === 'string' ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">{badge}</span>
        ) : badge}
        <OptionIndicator isCheckbox={role === 'checkbox'} selected={selected} />
      </div>
      {description && <p className="mt-1 text-[11px] text-slate-500 leading-normal">{description}</p>}
    </button>
  );
}
