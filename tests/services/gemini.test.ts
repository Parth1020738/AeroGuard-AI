import { describe, it, expect, vi } from 'vitest';
import { fetchAirQualityPlan } from '../../src/services/gemini';
import { generateFallbackSmogPlan, SMOG_PRESETS } from '../../src/services/fallbackSmogPlan';
import { HouseholdProfile } from '../../src/types/airQuality';

const mockProfile: HouseholdProfile = {
  city: 'Delhi NCR',
  outdoorAqi: 420,
  householdSize: 4,
  vulnerabilities: ['children', 'asthma_respiratory'],
  homeType: 'apartment',
  commuteMode: 'two_wheeler',
  cleanAirGear: 'none',
  cookingFuel: 'lpg_gas',
  updatedAt: new Date().toISOString(),
};

describe('Smog Plan Services', () => {
  describe('generateFallbackSmogPlan', () => {
    it('creates a complete 9-action plan offline with all 3 categories represented', () => {
      const plan = generateFallbackSmogPlan(mockProfile);

      expect(plan.isOfflineFallback).toBe(true);
      expect(plan.actions).toHaveLength(9);
      expect(plan.ventilationTimeline).toHaveLength(4);

      const categories = new Set(plan.actions.map((a) => a.category));
      expect(categories.has('low_emission_routine')).toBe(true);
      expect(categories.has('iaq_hack')).toBe(true);
      expect(categories.has('sustainable_alternative')).toBe(true);
    });

    it('adapts PM2.5 reduction values according to smog severity', () => {
      const severePlan = generateFallbackSmogPlan({ ...mockProfile, outdoorAqi: 450 });
      const mildPlan = generateFallbackSmogPlan({ ...mockProfile, outdoorAqi: 80 });

      const severeSum = severePlan.actions.reduce((s, a) => s + a.pm25ReductionUg, 0);
      const mildSum = mildPlan.actions.reduce((s, a) => s + a.pm25ReductionUg, 0);

      expect(severeSum).toBeGreaterThan(mildSum);
    });

    it('exports predefined high-impact winter smog presets', () => {
      expect(SMOG_PRESETS.length).toBeGreaterThanOrEqual(3);
      expect(SMOG_PRESETS[0]!.city).toContain('Delhi');
    });
  });

  describe('fetchAirQualityPlan fallback resilience', () => {
    it('seamlessly falls back to deterministic plan when API key is missing or empty', async () => {
      const originalKey = import.meta.env.VITE_GEMINI_API_KEY;
      vi.stubEnv('VITE_GEMINI_API_KEY', '');

      const plan = await fetchAirQualityPlan(mockProfile);
      expect(plan.isOfflineFallback).toBe(true);
      expect(plan.actions).toHaveLength(9);

      vi.stubEnv('VITE_GEMINI_API_KEY', originalKey || '');
    });

    it('catches network/parsing errors gracefully and returns fallback plan without throwing', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'invalid-test-key-triggering-catch');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const plan = await fetchAirQualityPlan(mockProfile);
      expect(plan).toBeDefined();
      expect(plan.actions.length).toBeGreaterThanOrEqual(6);

      warnSpy.mockRestore();
      vi.unstubAllEnvs();
    });
  });
});
