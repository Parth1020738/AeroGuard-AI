import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  AirQualityPlan,
  HouseholdProfile,
  ImpactMetrics,
  PersistedAppState,
} from '../types/airQuality';
import { calculateImpactMetrics } from '../utils/impactCalculator';
import { safeGetStorage, safeSetStorage } from '../utils/storage';
import { fetchAirQualityPlan } from '../services/gemini';
import { generateFallbackSmogPlan } from '../services/fallbackSmogPlan';
import { STORAGE_KEY } from '../constants/airQualityConstants';

export const DEFAULT_PROFILE: HouseholdProfile = {
  city: 'Delhi NCR',
  outdoorAqi: 420,
  householdSize: 4,
  vulnerabilities: ['children', 'seniors', 'asthma_respiratory'],
  homeType: 'apartment',
  commuteMode: 'two_wheeler',
  cleanAirGear: 'none',
  cookingFuel: 'lpg_gas',
  updatedAt: new Date().toISOString(),
};

export interface UseAirQualityPlannerResult {
  profile: HouseholdProfile;
  plan: AirQualityPlan | null;
  isLoading: boolean;
  error: string | null;
  impactMetrics: ImpactMetrics;
  hasCompletedOnboarding: boolean;
  updateProfile: (partial: Partial<HouseholdProfile>) => void;
  generatePlan: (customProfile?: HouseholdProfile) => Promise<void>;
  toggleAction: (actionId: string) => void;
  enableAllHighImpact: () => void;
  resetPlan: () => void;
}

/**
 * Primary state management hook coordinating profile configuration, API generation,
 * local storage synchronization, action toggle simulation, and offline fallback.
 * @returns State object and dispatch handlers for onboarding and dashboard views.
 */
export function useAirQualityPlanner(): UseAirQualityPlannerResult {
  const [persisted, setPersisted] = useState<PersistedAppState>(() => {
    return safeGetStorage<PersistedAppState>(STORAGE_KEY, {
      version: 1,
      profile: DEFAULT_PROFILE,
      activePlan: null,
      selectedActionIds: [],
      hasCompletedOnboarding: false,
      lastSyncTimestamp: 0,
    });
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync to localStorage on state change
  useEffect(() => {
    safeSetStorage(STORAGE_KEY, persisted);
  }, [persisted]);

  const profile = persisted.profile;
  const plan = persisted.activePlan;
  const hasCompletedOnboarding = persisted.hasCompletedOnboarding;

  const impactMetrics = useMemo<ImpactMetrics>(() => {
    if (!plan || !plan.actions) {
      return calculateImpactMetrics(profile, []);
    }
    return calculateImpactMetrics(profile, plan.actions);
  }, [profile, plan]);

  const updateProfile = useCallback((partial: Partial<HouseholdProfile>) => {
    setPersisted((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...partial,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const generatePlan = useCallback(
    async (customProfile?: HouseholdProfile): Promise<void> => {
      const targetProfile = customProfile ?? profile;
      setIsLoading(true);
      setError(null);

      try {
        const generated = await fetchAirQualityPlan(targetProfile);
        const selectedIds = generated.actions.filter((a) => a.enabled).map((a) => a.id);

        setPersisted((prev) => ({
          ...prev,
          profile: targetProfile,
          activePlan: generated,
          selectedActionIds: selectedIds,
          hasCompletedOnboarding: true,
          lastSyncTimestamp: Date.now(),
        }));
      } catch (err) {
        console.warn('[planner] Generation encountered issue, fallback invoked:', err);
        const fallback = generateFallbackSmogPlan(targetProfile);
        setPersisted((prev) => ({
          ...prev,
          profile: targetProfile,
          activePlan: fallback,
          selectedActionIds: fallback.actions.filter((a) => a.enabled).map((a) => a.id),
          hasCompletedOnboarding: true,
          lastSyncTimestamp: Date.now(),
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [profile]
  );

  const toggleAction = useCallback((actionId: string) => {
    setPersisted((prev) => {
      if (!prev.activePlan) return prev;
      const updatedActions = prev.activePlan.actions.map((act) =>
        act.id === actionId ? { ...act, enabled: !act.enabled } : act
      );
      const newSelected = updatedActions.filter((a) => a.enabled).map((a) => a.id);
      return {
        ...prev,
        activePlan: { ...prev.activePlan, actions: updatedActions },
        selectedActionIds: newSelected,
      };
    });
  }, []);

  const enableAllHighImpact = useCallback(() => {
    setPersisted((prev) => {
      if (!prev.activePlan) return prev;
      const updatedActions = prev.activePlan.actions.map((act) => ({
        ...act,
        enabled: true,
      }));
      return {
        ...prev,
        activePlan: { ...prev.activePlan, actions: updatedActions },
        selectedActionIds: updatedActions.map((a) => a.id),
      };
    });
  }, []);

  const resetPlan = useCallback(() => {
    const freshPlan = generateFallbackSmogPlan(DEFAULT_PROFILE);
    setPersisted({
      version: 1,
      profile: DEFAULT_PROFILE,
      activePlan: freshPlan,
      selectedActionIds: freshPlan.actions.filter((a) => a.enabled).map((a) => a.id),
      hasCompletedOnboarding: false,
      lastSyncTimestamp: Date.now(),
    });
  }, []);

  return {
    profile,
    plan,
    isLoading,
    error,
    impactMetrics,
    hasCompletedOnboarding,
    updateProfile,
    generatePlan,
    toggleAction,
    enableAllHighImpact,
    resetPlan,
  };
}
