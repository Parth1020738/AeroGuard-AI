import { describe, it, expect } from 'vitest';
import { calculateImpactMetrics } from '../../src/utils/impactCalculator';
import { HouseholdProfile, SmogActionItem } from '../../src/types/airQuality';

describe('impactCalculator utility', () => {
  const mockProfile: HouseholdProfile = {
    city: 'Delhi NCR',
    outdoorAqi: 400,
    householdSize: 4,
    vulnerabilities: ['children', 'asthma_respiratory'],
    homeType: 'apartment',
    commuteMode: 'two_wheeler',
    cleanAirGear: 'none',
    cookingFuel: 'lpg_gas',
    updatedAt: new Date().toISOString(),
  };

  const mockActions: SmogActionItem[] = [
    {
      id: 'a1',
      title: 'Action 1',
      category: 'low_emission_routine',
      steps: ['s1'],
      costLevel: 'free',
      difficulty: 'easy',
      scientificRationale: 'r1',
      pm25ReductionUg: 400,
      weeklyCo2SavedKg: 0,
      enabled: true,
    },
    {
      id: 'a2',
      title: 'Action 2',
      category: 'iaq_hack',
      steps: ['s2'],
      costLevel: 'low',
      difficulty: 'easy',
      scientificRationale: 'r2',
      pm25ReductionUg: 600,
      weeklyCo2SavedKg: 2.0,
      enabled: true,
    },
    {
      id: 'a3',
      title: 'Action 3',
      category: 'sustainable_alternative',
      steps: ['s3'],
      costLevel: 'moderate',
      difficulty: 'medium',
      scientificRationale: 'r3',
      pm25ReductionUg: 300,
      weeklyCo2SavedKg: 4.0,
      enabled: false,
    },
  ];

  it('computes higher baseline PM2.5 exposure for households with vulnerable members', () => {
    const vulnerableMetrics = calculateImpactMetrics(mockProfile, []);
    const nonVulnerableProfile = { ...mockProfile, vulnerabilities: ['none' as const] };
    const healthyMetrics = calculateImpactMetrics(nonVulnerableProfile, []);

    expect(vulnerableMetrics.baselineDailyPm25Ug).toBeGreaterThan(
      healthyMetrics.baselineDailyPm25Ug
    );
  });

  it('correctly calculates reduction from enabled actions only', () => {
    const metrics = calculateImpactMetrics(mockProfile, mockActions);
    // a1 (400) + a2 (600) = 1000 ug; a3 is disabled
    expect(metrics.dailyPm25ReductionUgm3).toBe(1000);
    expect(metrics.pm25ReductionPercent).toBeGreaterThan(0);
    expect(metrics.pm25ReductionPercent).toBeLessThanOrEqual(85);
  });

  it('caps PM2.5 reduction at physiological boundary (85%)', () => {
    const extremeActions: SmogActionItem[] = [
      {
        ...mockActions[0]!,
        pm25ReductionUg: 50000,
        enabled: true,
      },
    ];

    const metrics = calculateImpactMetrics(mockProfile, extremeActions);
    expect(metrics.pm25ReductionPercent).toBe(85);
    expect(metrics.dailyPm25ReductionUgm3).toBe(
      Math.round(metrics.baselineDailyPm25Ug * 0.85)
    );
  });

  it('scales weekly CO2 savings accurately by household size', () => {
    const singleMemberProfile = { ...mockProfile, householdSize: 1 };
    const singleMetrics = calculateImpactMetrics(singleMemberProfile, mockActions);

    const fourMemberMetrics = calculateImpactMetrics(mockProfile, mockActions);
    // Active CO2 is 2.0 kg from a2
    expect(singleMetrics.weeklyCo2SavedKg).toBe(2.0);
    // 2.0 * (1 + 3 * 0.45) = 2.0 * 2.35 = 4.7 kg
    expect(fourMemberMetrics.weeklyCo2SavedKg).toBe(4.7);
  });

  it('computes protection score bounded between 0 and 100', () => {
    const zeroMetrics = calculateImpactMetrics(mockProfile, []);
    expect(zeroMetrics.protectionScore).toBeGreaterThanOrEqual(0);
    expect(zeroMetrics.protectionScore).toBeLessThanOrEqual(100);

    const fullActions = mockActions.map((a) => ({ ...a, enabled: true }));
    const maxMetrics = calculateImpactMetrics(mockProfile, fullActions);
    expect(maxMetrics.protectionScore).toBeGreaterThan(zeroMetrics.protectionScore);
    expect(maxMetrics.protectionScore).toBeLessThanOrEqual(100);
  });
});
