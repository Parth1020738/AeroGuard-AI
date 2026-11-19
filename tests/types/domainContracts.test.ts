import { describe, it, expect } from 'vitest';
import {
  AqiSeverity,
  HouseholdProfile,
  SmogActionItem,
  VentilationWindow,
  AirQualityPlan,
} from '../../src/types/airQuality';

describe('airQuality domain model contracts', () => {
  it('instantiates valid domain interfaces with full type safety', () => {
    const severity: AqiSeverity = 'hazardous';
    expect(severity).toBe('hazardous');

    const profile: HouseholdProfile = {
      city: 'Delhi NCR',
      outdoorAqi: 420,
      householdSize: 4,
      vulnerabilities: ['children', 'asthma_respiratory'],
      homeType: 'apartment',
      commuteMode: 'two_wheeler',
      cleanAirGear: 'none',
      cookingFuel: 'lpg_gas',
      updatedAt: '2026-11-19T12:00:00Z',
    };
    expect(profile.city).toBe('Delhi NCR');

    const action: SmogActionItem = {
      id: 'test-action',
      title: 'Seal Doors',
      category: 'low_emission_routine',
      steps: ['Step 1'],
      costLevel: 'free',
      difficulty: 'easy',
      scientificRationale: 'Reduces draft',
      pm25ReductionUg: 300,
      weeklyCo2SavedKg: 0,
      enabled: true,
    };
    expect(action.enabled).toBe(true);

    const windowItem: VentilationWindow = {
      hourRange: '12:00 - 14:00',
      riskLevel: 'safe',
      title: 'Solar Window',
      instruction: 'Aerate',
      ambientAqiTrend: 'falling',
    };
    expect(windowItem.riskLevel).toBe('safe');

    const plan: AirQualityPlan = {
      planId: 'plan-1',
      city: 'Delhi',
      baselineOutdoorAqi: 420,
      severityLabel: 'Hazardous',
      generatedAt: '2026-11-19T12:00:00Z',
      isOfflineFallback: true,
      summaryHeadline: 'Emergency',
      actions: [action],
      ventilationTimeline: [windowItem],
      communityAdvisoryText: 'Stay safe',
    };
    expect(plan.actions).toHaveLength(1);
  });
});
