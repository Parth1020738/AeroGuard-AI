import React, { useState } from 'react';
import { AirQualityPlan } from '../../types/airQuality';
import { sanitizeFileName } from '../../utils/sanitizers';
import { Share2, Copy, Check, Download, Printer } from 'lucide-react';

interface CommunityCardProps {
  plan: AirQualityPlan;
}

export function CommunityCard({ plan }: CommunityCardProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(plan.communityAdvisoryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('[community] Failed to copy text to clipboard:', err);
    }
  };

  const handleDownloadJson = (): void => {
    const filename = `${sanitizeFileName(plan.city)}-smog-plan.json`;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = (): void => {
    window.print();
  };

  return (
    <section
      role="region"
      aria-labelledby="community-advisory-heading"
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h2 id="community-advisory-heading" className="text-xl font-bold text-slate-900 tracking-tight">
            School & Neighborhood Smog Advisory
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                Copy Notice
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Export JSON
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            Print Advisory
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-all">
        {plan.communityAdvisoryText}
      </div>

      <p className="text-[11px] text-slate-500">
        Ready to broadcast across apartment WhatsApp groups, school parent councils, and community bulletin boards.
      </p>
    </section>
  );
}
