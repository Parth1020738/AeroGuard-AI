import React from 'react';

export interface MetricBadgeProps {
  label: string;
  value?: string | number;
  unit?: string;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'card' | 'pill';
  valueColorClass?: string;
  className?: string;
  progressPercent?: number;
}

function MetricCard({
  label,
  value,
  unit,
  subtext,
  icon,
  valueColorClass = 'text-slate-900',
  progressPercent,
}: MetricBadgeProps): React.JSX.Element {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
      <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${valueColorClass}`}>
          {value}
        </span>
        {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
      </div>
      {subtext && <p className="mt-1 text-xs text-slate-500 font-medium">{subtext}</p>}
      {typeof progressPercent === 'number' && (
        <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-teal-700 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function MetricBadge(props: MetricBadgeProps): React.JSX.Element {
  if (props.variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
          props.className ?? 'bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        {props.icon}
        <span>{props.label}</span>
        {props.value !== undefined && <span className="tabular-nums">{props.value}</span>}
      </span>
    );
  }

  return <MetricCard {...props} />;
}
