import React from 'react';
import { HouseholdProfile, HomeType, VulnerabilityGroup } from '../../types/airQuality';
import { DWELLING_OPTIONS, VULNERABILITY_OPTIONS } from './wizardConstants';
import { ValidationErrors } from '../../utils/validators';
import { SelectableOption } from '../common/SelectableOption';

interface WizardStep2Props {
  profile: HouseholdProfile;
  errors: ValidationErrors;
  onChange: (partial: Partial<HouseholdProfile>) => void;
}

export function WizardStep2({ profile, errors, onChange }: WizardStep2Props): React.JSX.Element {
  const handleToggleVulnerability = (group: VulnerabilityGroup): void => {
    let current = [...profile.vulnerabilities];
    if (group === 'none') {
      current = ['none'];
    } else {
      current = current.filter((v) => v !== 'none');
      if (current.includes(group)) {
        current = current.filter((v) => v !== group);
        if (current.length === 0) current = ['none'];
      } else {
        current.push(group);
      }
    }
    onChange({ vulnerabilities: current });
  };

  return (
    <section className="space-y-6" aria-labelledby="step2-title">
      <div>
        <h2 id="step2-title" className="text-xl font-bold text-slate-900 tracking-tight">
          Step 2: Dwelling & Vulnerability Profile
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Tailor indoor particulate filtration algorithms to your dwelling type and sensitive household members.
        </p>
      </div>

      {/* Dwelling Type */}
      <div>
        <label htmlFor="dwelling-select" className="block text-sm font-medium text-slate-800 mb-1.5">
          Home Dwelling Architecture
        </label>
        <select
          id="dwelling-select"
          value={profile.homeType}
          onChange={(e) => onChange({ homeType: e.target.value as HomeType })}
          aria-describedby={errors.homeType ? 'dwelling-error' : undefined}
          className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
        >
          {DWELLING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.homeType && (
          <p id="dwelling-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.homeType}
          </p>
        )}
      </div>

      {/* Vulnerabilities Chips */}
      <div>
        <span id="vuln-label" className="block text-sm font-medium text-slate-800 mb-2">
          Household Vulnerability Categories (Select all that apply)
        </span>
        <div
          role="group"
          aria-labelledby="vuln-label"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {VULNERABILITY_OPTIONS.map((opt) => (
            <SelectableOption
              key={opt.value}
              label={opt.label}
              selected={profile.vulnerabilities.includes(opt.value)}
              onSelect={() => handleToggleVulnerability(opt.value)}
              description={opt.description}
              role="checkbox"
            />
          ))}
        </div>
        {errors.vulnerabilities && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.vulnerabilities}</p>
        )}
      </div>
    </section>
  );
}
