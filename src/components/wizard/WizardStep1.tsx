import React, { useState } from 'react';
import { HouseholdProfile } from '../../types/airQuality';
import { SMOG_PRESETS } from '../../services/fallbackSmogPlan';
import { fetchLiveCityAqi } from '../../services/liveAqiService';
import { getIndianQuickCities, formatTelemetryBadge } from './wizardCityHelpers';
import { ValidationErrors } from '../../utils/validators';
import { SelectableOption } from '../common/SelectableOption';
import { Flame, Radio, Loader2, CheckCircle2 } from 'lucide-react';

interface WizardStep1Props {
  profile: HouseholdProfile;
  errors: ValidationErrors;
  onChange: (partial: Partial<HouseholdProfile>) => void;
}

function QuickCitySelector({
  cities,
  disabled,
}: {
  cities: ReturnType<typeof getIndianQuickCities>;
  disabled: boolean;
}): React.JSX.Element {
  return (
    <div>
      <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Radio className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
        Live Telemetry Cities (Click to Auto-Fetch)
      </span>
      <div className="flex flex-wrap gap-2">
        {cities.map((item) => (
          <button
            key={item.name}
            type="button"
            disabled={disabled}
            onClick={item.onClick}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
              item.isSelected
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function PresetSelector({
  profile,
  onChange,
}: {
  profile: HouseholdProfile;
  onChange: (partial: Partial<HouseholdProfile>) => void;
}): React.JSX.Element {
  return (
    <div>
      <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Flame className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
        Rapid Winter Inversion Presets
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SMOG_PRESETS.map((preset) => (
          <SelectableOption
            key={preset.id}
            label={preset.city}
            selected={profile.city === preset.city && profile.outdoorAqi === preset.aqi}
            onSelect={() => onChange({ city: preset.city, outdoorAqi: preset.aqi, liveReading: undefined })}
            badge={`AQI ${preset.aqi}`}
            description={preset.description}
            role="button"
          />
        ))}
      </div>
    </div>
  );
}

export function WizardStep1({ profile, errors, onChange }: WizardStep1Props): React.JSX.Element {
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);

  const handleFetchLive = async (targetCity?: string): Promise<void> => {
    const cityToFetch = targetCity ?? profile.city;
    if (!cityToFetch || cityToFetch.trim().length < 2) return;
    setIsFetchingLive(true);
    setLiveStatus(null);
    try {
      const reading = await fetchLiveCityAqi(cityToFetch);
      onChange({ city: reading.city, outdoorAqi: reading.aqi, liveReading: reading });
      setLiveStatus(`Live telemetry connected for ${reading.city}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Telemetry service unavailable';
      setLiveStatus(`Offline notice: ${msg}. You can continue with manual/preset AQI.`);
    } finally {
      setIsFetchingLive(false);
    }
  };

  const telemetry = formatTelemetryBadge(profile);
  const quickCities = getIndianQuickCities(profile.city, (c) => {
    onChange({ city: c });
    void handleFetchLive(c);
  });

  return (
    <section className="space-y-5" aria-labelledby="step1-title">
      <div>
        <h2 id="step1-title" className="text-xl font-bold text-slate-900 tracking-tight">Step 1: Location & Smog Severity</h2>
        <p className="mt-1 text-sm text-slate-600">Connect live real-time AQI telemetry, select a winter preset, or enter data manually.</p>
      </div>

      <QuickCitySelector cities={quickCities} disabled={isFetchingLive} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city-input" className="block text-sm font-medium text-slate-800 mb-1.5">City / Neighborhood Name</label>
          <div className="flex gap-2">
            <input
              id="city-input"
              type="text"
              aria-required="true"
              value={profile.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="e.g. Delhi, Noida, Mumbai"
              className={`block w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 ${errors.city ? 'border-red-500' : 'border-slate-300'}`}
            />
            <button
              type="button"
              disabled={isFetchingLive || !profile.city.trim()}
              onClick={() => void handleFetchLive()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg shrink-0 transition-colors disabled:opacity-50"
            >
              {isFetchingLive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
              Fetch Live
            </button>
          </div>
          {errors.city && <p className="mt-1 text-xs text-red-600 font-medium">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="aqi-input" className="block text-sm font-medium text-slate-800 mb-1.5">Current Outdoor AQI (0–999)</label>
          <input
            id="aqi-input"
            type="number"
            min={0}
            max={999}
            aria-required="true"
            value={Number.isNaN(profile.outdoorAqi) ? '' : profile.outdoorAqi}
            onChange={(e) => onChange({ outdoorAqi: parseInt(e.target.value, 10) || 0, liveReading: undefined })}
            className={`block w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 ${errors.outdoorAqi ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.outdoorAqi && <p className="mt-1 text-xs text-red-600 font-medium">{errors.outdoorAqi}</p>}
        </div>
      </div>

      {telemetry && (
        <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-xl text-xs flex items-start gap-2 text-teal-900">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold">{telemetry.headline}</span>
            <p className="text-teal-700 mt-0.5 text-[11px]">{telemetry.subline}</p>
          </div>
        </div>
      )}
      {liveStatus && !telemetry && <p className="text-xs text-slate-500 font-medium">{liveStatus}</p>}

      <PresetSelector profile={profile} onChange={onChange} />
    </section>
  );
}
