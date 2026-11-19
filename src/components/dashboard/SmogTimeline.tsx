import React from 'react';
import { VentilationWindow, VentilationRiskLevel } from '../../types/airQuality';
import { Clock, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

interface SmogTimelineProps {
  timeline: VentilationWindow[];
}

export function SmogTimeline({ timeline }: SmogTimelineProps): React.JSX.Element {
  const riskBadgeConfig: Record<
    VentilationRiskLevel,
    { label: string; bg: string; text: string; icon: typeof ShieldAlert }
  > = {
    lockdown: {
      label: 'Strict Inversion Lockdown',
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: ShieldAlert,
    },
    caution: {
      label: 'Caution Window',
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: AlertTriangle,
    },
    safe: {
      label: 'Safe Ventilation Window',
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
    },
  };

  return (
    <section
      role="region"
      aria-labelledby="timeline-heading"
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-teal-700" aria-hidden="true" />
        <h2 id="timeline-heading" className="text-xl font-bold text-slate-900 tracking-tight">
          Hourly Inversion & Safe Ventilation Schedule
        </h2>
      </div>
      <p className="text-xs text-slate-600">
        Winter meteorological inversions trap morning surface smoke. Air out homes only during midday solar mixing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {timeline.map((win, idx) => {
          const config = riskBadgeConfig[win.riskLevel];
          const IconComponent = config.icon;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${config.bg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {win.hourRange}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${config.bg} ${config.text}`}
                  >
                    <IconComponent className="w-3 h-3" aria-hidden="true" />
                    {config.label}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{win.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{win.instruction}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Ambient Smoke Trend:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {win.ambientAqiTrend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
