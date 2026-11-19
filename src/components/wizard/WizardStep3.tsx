import React from 'react';
import { HouseholdProfile, CommuteMode, CookingFuel, CleanAirGear } from '../../types/airQuality';
import { COMMUTE_OPTIONS, FUEL_OPTIONS, GEAR_OPTIONS } from './wizardConstants';
import { ValidationErrors } from '../../utils/validators';

interface WizardStep3Props {
  profile: HouseholdProfile;
  errors: ValidationErrors;
  onChange: (partial: Partial<HouseholdProfile>) => void;
}

export function WizardStep3({ profile, errors, onChange }: WizardStep3Props): React.JSX.Element {
  return (
    <section className="space-y-6" aria-labelledby="step3-title">
      <div>
        <h2 id="step3-title" className="text-xl font-bold text-slate-900 tracking-tight">
          Step 3: Commute & Home Setup
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Identify your primary exposure points during transit and baseline indoor clean-air gear.
        </p>
      </div>

      {/* Commute Mode */}
      <div>
        <label htmlFor="commute-select" className="block text-sm font-medium text-slate-800 mb-1.5">
          Daily Commute & Travel Mode
        </label>
        <select
          id="commute-select"
          value={profile.commuteMode}
          onChange={(e) => onChange({ commuteMode: e.target.value as CommuteMode })}
          aria-describedby={errors.commuteMode ? 'commute-error' : undefined}
          className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
        >
          {COMMUTE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.commuteMode && (
          <p id="commute-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.commuteMode}
          </p>
        )}
      </div>

      {/* Cooking Fuel */}
      <div>
        <label htmlFor="fuel-select" className="block text-sm font-medium text-slate-800 mb-1.5">
          Primary Indoor Cooking / Heating Fuel
        </label>
        <select
          id="fuel-select"
          value={profile.cookingFuel}
          onChange={(e) => onChange({ cookingFuel: e.target.value as CookingFuel })}
          aria-describedby={errors.cookingFuel ? 'fuel-error' : undefined}
          className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
        >
          {FUEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.cookingFuel && (
          <p id="fuel-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.cookingFuel}
          </p>
        )}
      </div>

      {/* Clean Air Equipment */}
      <div>
        <label htmlFor="gear-select" className="block text-sm font-medium text-slate-800 mb-1.5">
          Current Clean-Air Equipment On Hand
        </label>
        <select
          id="gear-select"
          value={profile.cleanAirGear}
          onChange={(e) => onChange({ cleanAirGear: e.target.value as CleanAirGear })}
          aria-describedby={errors.cleanAirGear ? 'gear-error' : undefined}
          className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
        >
          {GEAR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.cleanAirGear && (
          <p id="gear-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.cleanAirGear}
          </p>
        )}
      </div>
    </section>
  );
}
