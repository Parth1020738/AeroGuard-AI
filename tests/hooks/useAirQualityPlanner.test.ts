import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAirQualityPlanner, DEFAULT_PROFILE } from '../../src/hooks/useAirQualityPlanner';

// Mock fetchAirQualityPlan to return fallback plan instantly without calling live Gemini network
vi.mock('../../src/services/gemini', () => ({
  fetchAirQualityPlan: vi.fn(async (profile) => {
    const { generateFallbackSmogPlan } = await import('../../src/services/fallbackSmogPlan');
    return generateFallbackSmogPlan(profile);
  }),
}));

describe('useAirQualityPlanner hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with default household profile and baseline metrics', () => {
    const { result } = renderHook(() => useAirQualityPlanner());

    expect(result.current.profile.city).toBe(DEFAULT_PROFILE.city);
    expect(result.current.profile.outdoorAqi).toBe(DEFAULT_PROFILE.outdoorAqi);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasCompletedOnboarding).toBe(false);
  });

  it('updates profile parameters immutably', () => {
    const { result } = renderHook(() => useAirQualityPlanner());

    act(() => {
      result.current.updateProfile({ city: 'Lucknow', outdoorAqi: 360 });
    });

    expect(result.current.profile.city).toBe('Lucknow');
    expect(result.current.profile.outdoorAqi).toBe(360);
  });

  it('generates plan and marks onboarding as completed', async () => {
    const { result } = renderHook(() => useAirQualityPlanner());

    await act(async () => {
      await result.current.generatePlan();
    });

    expect(result.current.plan).not.toBeNull();
    expect(result.current.hasCompletedOnboarding).toBe(true);
    expect(result.current.plan?.actions.length).toBeGreaterThan(0);
  });

  it('toggles individual actions and dynamically updates impact metrics', async () => {
    const { result } = renderHook(() => useAirQualityPlanner());

    await act(async () => {
      await result.current.generatePlan();
    });

    const firstAction = result.current.plan!.actions[0]!;
    const initialReduction = result.current.impactMetrics.dailyPm25ReductionUgm3;

    act(() => {
      result.current.toggleAction(firstAction.id);
    });

    const updatedFirstAction = result.current.plan!.actions.find(
      (a) => a.id === firstAction.id
    );
    expect(updatedFirstAction?.enabled).toBe(!firstAction.enabled);

    const updatedReduction = result.current.impactMetrics.dailyPm25ReductionUgm3;
    expect(updatedReduction).not.toBe(initialReduction);
  });

  it('enables all high impact actions upon bulk toggle', async () => {
    const { result } = renderHook(() => useAirQualityPlanner());

    await act(async () => {
      await result.current.generatePlan();
    });

    act(() => {
      result.current.enableAllHighImpact();
    });

    const allEnabled = result.current.plan!.actions.every((a) => a.enabled);
    expect(allEnabled).toBe(true);
  });

  it('resets state cleanly to fresh default fallback', async () => {
    const { result } = renderHook(() => useAirQualityPlanner());

    await act(async () => {
      await result.current.generatePlan({
        ...DEFAULT_PROFILE,
        city: 'Agra',
        outdoorAqi: 280,
      });
    });

    expect(result.current.profile.city).toBe('Agra');

    act(() => {
      result.current.resetPlan();
    });

    expect(result.current.profile.city).toBe(DEFAULT_PROFILE.city);
    expect(result.current.hasCompletedOnboarding).toBe(false);
  });
});
