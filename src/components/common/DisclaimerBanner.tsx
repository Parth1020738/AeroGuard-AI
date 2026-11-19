import React from 'react';
import { Info } from 'lucide-react';

interface DisclaimerBannerProps {
  className?: string;
}

/**
 * Accessible scientific disclaimer banner
 * Explicitly communicates that reduction metrics are modeled heuristics, not medical diagnoses.
 */
export function DisclaimerBanner({ className = '' }: DisclaimerBannerProps): React.JSX.Element {
  return (
    <aside
      role="note"
      aria-label="Scientific and Medical Estimation Disclaimer"
      className={`bg-slate-100 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600 flex items-start gap-3 ${className}`}
    >
      <Info
        className="w-4 h-4 text-teal-700 mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <div className="leading-relaxed">
        <strong className="font-semibold text-slate-800">
          Environmental Science Advisory:&nbsp;
        </strong>
        PM2.5 inhalation reduction and CO₂ prevention metrics are computed estimates based
        on standard EPA/WHO respiratory models and urban air quality heuristics. This tool
        is designed for risk-reduction guidance and does not replace medical advice or clinical diagnosis.
      </div>
    </aside>
  );
}
