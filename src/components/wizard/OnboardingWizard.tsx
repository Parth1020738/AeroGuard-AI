import React, { useState } from 'react';
import { HouseholdProfile } from '../../types/airQuality';
import {
  validateProfileStep1,
  validateProfileStep2,
  validateProfileStep3,
  ValidationErrors,
} from '../../utils/validators';
import { WizardStep1 } from './WizardStep1';
import { WizardStep2 } from './WizardStep2';
import { WizardStep3 } from './WizardStep3';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingWizardProps {
  initialProfile: HouseholdProfile;
  onSubmit: (profile: HouseholdProfile) => Promise<void>;
  isLoading: boolean;
}

export function OnboardingWizard({
  initialProfile,
  onSubmit,
  isLoading,
}: OnboardingWizardProps): React.JSX.Element {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profile, setProfile] = useState<HouseholdProfile>(initialProfile);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleUpdate = (partial: Partial<HouseholdProfile>): void => {
    setProfile((prev) => ({ ...prev, ...partial }));
    setErrors({});
  };

  const handleNext = (): void => {
    if (step === 1) {
      const step1Errors = validateProfileStep1(profile);
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const step2Errors = validateProfileStep2(profile);
      if (Object.keys(step2Errors).length > 0) {
        setErrors(step2Errors);
        return;
      }
      setStep(3);
    }
  };

  const handleBack = (): void => {
    if (step > 1) {
      setErrors({});
      setStep((prev) => (prev - 1) as 1 | 2);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const step3Errors = validateProfileStep3(profile);
    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors);
      return;
    }
    await onSubmit(profile);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Accessible Step Progress */}
      <nav aria-label="Onboarding Progress" className="mb-8">
        <ol className="flex items-center justify-between text-xs font-semibold text-slate-500">
          {[
            { num: 1, label: 'Location & AQI' },
            { num: 2, label: 'Vulnerabilities' },
            { num: 3, label: 'Commute & Gear' },
          ].map((s) => (
            <li
              key={s.num}
              aria-current={step === s.num ? 'step' : undefined}
              className={`flex items-center gap-2 ${step === s.num ? 'text-teal-700' : ''}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.num
                    ? 'bg-teal-700 text-white'
                    : step > s.num
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-500'
                }`}
              >
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </li>
          ))}
        </ol>
      </nav>

      <form onSubmit={handleSubmit}>
        {step === 1 && <WizardStep1 profile={profile} errors={errors} onChange={handleUpdate} />}
        {step === 2 && <WizardStep2 profile={profile} errors={errors} onChange={handleUpdate} />}
        {step === 3 && <WizardStep3 profile={profile} errors={errors} onChange={handleUpdate} />}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 shadow-sm transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 shadow-sm transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              {isLoading ? 'Generating Smog Defense...' : 'Generate Smog Action Plan'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
