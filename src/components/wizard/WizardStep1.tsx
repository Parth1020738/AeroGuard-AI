import React from 'react';
import { HouseholdProfile, SmogPreset } from '../../types/airQuality';
import { SMOG_PRESETS } from '../../services/fallbackSmogPlan';
import { ValidationErrors } from '../../utils/validators';
import { Flame } from 'lucide-react';

interface WizardStep1Props {
  profile: HouseholdProfile;
  errors: ValidationErrors;
  onChange: (partial: Partial<HouseholdProfile>) => void;
}

export function WizardStep1({ profile, errors, onChange }: WizardStep1Props): React.JSX.Element {
  const handlePresetClick = (preset: SmogPreset): void => {
    onChange({
      city: preset.city,
      outdoorAqi: preset.aqi,
    });
  };

  return (
    <section className="space-y-6" aria-labelledby="step1-title">
      <div>
        <h2 id="step1-title" className="text-xl font-bold text-slate-900 tracking-tight">
          Step 1: Location & Smog Severity
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter your local urban area and current outdoor AQI, or select an instant winter smog preset.
        </p>
      </div>

      {/* 1-Click Smog Presets */}
      <div>
        <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-600" aria-hidden="true" />
          Rapid Winter Smog Presets
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SMOG_PRESETS.map((preset) => {
            const isSelected = profile.city === preset.city && profile.outdoorAqi === preset.aqi;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`p-3 text-left rounded-xl border transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>{preset.city}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                    AQI {preset.aqi}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city-input" className="block text-sm font-medium text-slate-800 mb-1.5">
            City / Neighborhood Name
          </label>
          <input
            id="city-input"
            type="text"
            value={profile.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="e.g. Delhi NCR, Lahore, Salt Lake City"
            aria-describedby={errors.city ? 'city-error' : undefined}
            className={`block w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 ${
              errors.city ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-teal-600'
            }`}
          />
          {errors.city && (
            <p id="city-error" className="mt-1 text-xs text-red-600 font-medium">
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="aqi-input" className="block text-sm font-medium text-slate-800 mb-1.5">
            Current Outdoor AQI (0–999)
          </label>
          <input
            id="aqi-input"
            type="number"
            min={0}
            max={999}
            value={Number.isNaN(profile.outdoorAqi) ? '' : profile.outdoorAqi}
            onChange={(e) => onChange({ outdoorAqi: parseInt(e.target.value, 10) || 0 })}
            aria-describedby={errors.outdoorAqi ? 'aqi-error' : undefined}
            className={`block w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 ${
              errors.outdoorAqi ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-teal-600'
            }`}
          />
          {errors.outdoorAqi && (
            <p id="aqi-error" className="mt-1 text-xs text-red-600 font-medium">
              {errors.outdoorAqi}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="household-size-input" className="block text-sm font-medium text-slate-800 mb-1.5">
          Household Members Living Together (1–20)
        </label>
        <input
          id="household-size-input"
          type="number"
          min={1}
          max={20}
          value={profile.householdSize}
          onChange={(e) => onChange({ householdSize: parseInt(e.target.value, 10) || 1 })}
          aria-describedby={errors.householdSize ? 'household-size-error' : undefined}
          className={`block w-full max-w-xs px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 ${
            errors.householdSize ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-teal-600'
          }`}
        />
        {errors.householdSize && (
          <p id="household-size-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.householdSize}
          </p>
        )}
      </div>
    </section>
  );
}
