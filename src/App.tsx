import React, { useState } from 'react';
import { useAirQualityPlanner } from './hooks/useAirQualityPlanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { MetricBadge } from './components/common/MetricBadge';
import { OnboardingWizard } from './components/wizard/OnboardingWizard';
import { ImpactSimulator } from './components/dashboard/ImpactSimulator';
import { ActionPillars } from './components/dashboard/ActionPillars';
import { SmogTimeline } from './components/dashboard/SmogTimeline';
import { CommunityCard } from './components/dashboard/CommunityCard';
import { ShieldCheck, SlidersHorizontal, RefreshCw, Radio } from 'lucide-react';

export function App(): React.JSX.Element {
  const {
    profile,
    plan,
    isLoading,
    impactMetrics,
    hasCompletedOnboarding,
    generatePlan,
    toggleAction,
    enableAllHighImpact,
    resetPlan,
  } = useAirQualityPlanner();

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleWizardSubmit = async (updatedProfile: typeof profile): Promise<void> => {
    setIsEditingProfile(false);
    await generatePlan(updatedProfile);
  };

  const showWizard = !hasCompletedOnboarding || isEditingProfile;

  return (
    <ErrorBoundary>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900">
        {/* Sticky App Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-8 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 shadow-sm">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-900 tracking-tight">AeroGuard</span>
                  <span className="text-sm font-extrabold text-teal-700">AI</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 block -mt-0.5">
                  Winter Smog Defense & Community Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {plan && (
                <MetricBadge
                  variant="pill"
                  className="hidden sm:inline-flex bg-slate-100 text-slate-700 border-slate-200"
                  icon={
                    profile.liveReading?.isLive ? (
                      <Radio className="w-2.5 h-2.5 text-teal-700 animate-pulse" aria-hidden="true" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                    )
                  }
                  label={`${profile.city} (AQI ${profile.outdoorAqi})`}
                />
              )}

              {hasCompletedOnboarding && !showWizard && (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                  Edit Profile
                </button>
              )}

              <button
                type="button"
                onClick={resetPlan}
                aria-label="Reset profile and reload plan"
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {showWizard ? (
            <OnboardingWizard
              initialProfile={profile}
              onSubmit={handleWizardSubmit}
              isLoading={isLoading}
            />
          ) : isLoading ? (
            <LoadingSkeleton label="Synthesizing personalized winter smog defense plan..." rows={3} />
          ) : plan ? (
            <>
              <ImpactSimulator
                metrics={impactMetrics}
                liveReading={profile.liveReading}
                onEnableAll={enableAllHighImpact}
              />
              <ActionPillars actions={plan.actions} onToggle={toggleAction} />
              <SmogTimeline timeline={plan.ventilationTimeline} />
              <CommunityCard plan={plan} />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-sm">No plan loaded.</p>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
