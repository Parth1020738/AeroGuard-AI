import React from 'react';
import { SmogActionItem } from '../../types/airQuality';
import { CheckCircle2, ShieldQuestion } from 'lucide-react';

interface ActionCardProps {
  action: SmogActionItem;
  onToggle: (id: string) => void;
}

export function ActionCard({ action, onToggle }: ActionCardProps): React.JSX.Element {
  const costLabels = {
    free: 'Free DIY',
    low: 'Low Cost',
    moderate: 'Moderate Investment',
  };

  return (
    <article
      className={`p-5 rounded-2xl border transition-all ${
        action.enabled
          ? 'border-teal-600 bg-teal-50/40 shadow-sm ring-1 ring-teal-600'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              {costLabels[action.costLevel]}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-800">
              -{action.pm25ReductionUg} µg PM2.5
            </span>
            {action.weeklyCo2SavedKg > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">
                +{action.weeklyCo2SavedKg} kg CO₂/wk
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">{action.title}</h3>
        </div>

        {/* Accessible Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={action.enabled}
          aria-label={`Toggle action: ${action.title}`}
          onClick={() => onToggle(action.id)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
            action.enabled ? 'bg-teal-700' : 'bg-slate-300'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              action.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Steps */}
      <div className="mt-3 space-y-1.5">
        {action.steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{step}</span>
          </div>
        ))}
      </div>

      {/* Why This Works Accordion / Explanation */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-start gap-1.5 text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <ShieldQuestion className="w-3.5 h-3.5 text-teal-700 mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <strong className="font-semibold text-slate-800">Why This Works:&nbsp;</strong>
            {action.scientificRationale}
          </div>
        </div>
      </div>
    </article>
  );
}
