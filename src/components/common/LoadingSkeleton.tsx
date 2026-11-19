import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  label?: string;
  rows?: number;
}

/**
 * Accessible Loading Skeleton
 * Conforms to WCAG 2.1 AA with role="status" and aria-live="polite".
 */
export function LoadingSkeleton({
  label = 'Synthesizing clean-air defense plan...',
  rows = 3,
}: LoadingSkeletonProps): React.JSX.Element {
  return (
    <section
      role="status"
      aria-live="polite"
      className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <Loader2 className="w-5 h-5 text-teal-700 animate-spin" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-800">{label}</span>
      </div>

      <div className="space-y-4" aria-hidden="true">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-slate-100 rounded-lg p-4 space-y-2.5 border border-slate-100"
          >
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-5/6" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading recommendations, please wait...</span>
    </section>
  );
}
