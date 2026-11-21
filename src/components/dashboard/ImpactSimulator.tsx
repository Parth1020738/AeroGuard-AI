import React from 'react';
import { ImpactMetrics, LiveAqiReading } from '../../types/airQuality';
import { MetricBadge } from '../common/MetricBadge';
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
        <MetricBadge
          icon={<Activity className="w-4 h-4 text-teal-700" aria-hidden="true" />}
          label="Daily PM2.5 Inhaled Reduction"
          value={`-${metrics.dailyPm25ReductionUgm3}`}
          unit="µg/day"
          subtext={`↓ ${metrics.pm25ReductionPercent}% reduction from baseline`}
          valueColorClass="text-teal-800"
        />
        <MetricBadge
          icon={<Leaf className="w-4 h-4 text-green-700" aria-hidden="true" />}
          label="Weekly Carbon Prevented"
          value={metrics.weeklyCo2SavedKg}
          unit="kg CO₂e"
          subtext="Scaled to household transit & fuel"
          valueColorClass="text-green-800"
        />
        <MetricBadge
          icon={<ShieldAlert className="w-4 h-4 text-teal-700" aria-hidden="true" />}
          label="Household Protection Score"
          value={metrics.protectionScore}
          unit="/ 100"
          progressPercent={metrics.protectionScore}
        />
      </div>
    </section>
  );
}
