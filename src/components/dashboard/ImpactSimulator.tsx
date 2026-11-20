import React from 'react';
import { ImpactMetrics, LiveAqiReading } from '../../types/airQuality';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { ShieldAlert, Activity, Leaf, Zap, Radio } from 'lucide-react';

interface ImpactSimulatorProps {
  metrics: ImpactMetrics;
  liveReading?: LiveAqiReading;
  onEnableAll: () => void;
}

export function ImpactSimulator({
  metrics,
  liveReading,
  onEnableAll,
}: ImpactSimulatorProps): React.JSX.Element {
  return (
    <section
      role="region"
      aria-label="Household Impact Simulation"
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-teal-700 tracking-wider uppercase">
              Live Simulation Engine
            </span>
            {liveReading?.isLive ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <Radio className="w-2.5 h-2.5 text-teal-700 animate-pulse" aria-hidden="true" />
                Live: PM2.5 {liveReading.pm25} µg/m³ • PM10 {liveReading.pm10} µg/m³
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                Simulated Baseline
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Direct Choice Impact Simulator
          </h2>
        </div>

        <button
          type="button"
          onClick={onEnableAll}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 self-start sm:self-auto"
        >
          <Zap className="w-3.5 h-3.5" aria-hidden="true" />
          Enable All High-Impact Actions
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div
        role="status"
        aria-live="polite"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* PM2.5 Inhalation Reduction */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1.5">
            <Activity className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>Daily PM2.5 Inhaled Reduction</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-800 tabular-nums">
              -{metrics.dailyPm25ReductionUgm3}
            </span>
            <span className="text-xs font-semibold text-teal-700">µg/day</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            ↓ {metrics.pm25ReductionPercent}% reduction from baseline
          </p>
        </div>

        {/* Weekly Carbon Saved */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1.5">
            <Leaf className="w-4 h-4 text-green-700" aria-hidden="true" />
            <span>Weekly Carbon Prevented</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-green-800 tabular-nums">
              {metrics.weeklyCo2SavedKg}
            </span>
            <span className="text-xs font-semibold text-green-700">kg CO₂e</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Scaled to household transit & fuel
          </p>
        </div>

        {/* Protection Score */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1.5">
            <ShieldAlert className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>Household Protection Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {metrics.protectionScore}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-teal-700 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, metrics.protectionScore)}%` }}
            />
          </div>
        </div>
      </div>

      <DisclaimerBanner />
    </section>
  );
}
