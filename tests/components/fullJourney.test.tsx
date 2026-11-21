import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../src/App';
import { clearGeoCache } from '../../src/services/liveAqiService';

vi.mock('../../src/services/gemini', () => ({
  fetchAirQualityPlan: vi.fn(async (profile) => {
    const { generateFallbackSmogPlan } = await import('../../src/services/fallbackSmogPlan');
    return generateFallbackSmogPlan(profile);
  }),
}));

describe('AeroGuard AI Full Journey & Persistence E2E', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearGeoCache();
    vi.restoreAllMocks();
  });

  it('completes the entire user journey: live telemetry caching, multi-step onboarding, localStorage persistence, and profile editing', async () => {
    let geocodingCallCount = 0;
    let aqiCallCount = 0;

    const mockGeoPayload = {
      results: [{ name: 'Noida', latitude: 28.53, longitude: 77.39, country: 'India' }],
    };
    const mockAqiPayload = {
      current: { us_aqi: 285, pm2_5: 210.5, pm10: 315.2, time: '2026-11-21T18:00' },
    };

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('geocoding-api.open-meteo.com')) {
        geocodingCallCount++;
        return { ok: true, json: async () => mockGeoPayload } as Response;
      }
      if (urlStr.includes('air-quality-api.open-meteo.com')) {
        aqiCallCount++;
        return { ok: true, json: async () => mockAqiPayload } as Response;
      }
      return { ok: false, status: 404 } as Response;
    });

    // 1. Initial Render & Accessible Landmark verification
    const { unmount } = render(<App />);
    expect(screen.getByText(/Step 1: Location & Smog Severity/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Skip to main content/i })).toBeInTheDocument();

    // 2. Live Telemetry Fetch & Caching Verification
    const cityInput = screen.getByLabelText(/City \/ Neighborhood Name/i);
    fireEvent.change(cityInput, { target: { value: 'Noida' } });

    const fetchLiveBtn = screen.getByRole('button', { name: /Fetch Live/i });
    fireEvent.click(fetchLiveBtn);

    expect(await screen.findByText(/Live Noida: AQI 285/i)).toBeInTheDocument();
    expect(geocodingCallCount).toBe(1);
    expect(aqiCallCount).toBe(1);

    // Repeat lookup for the same city: Geocoding must be retrieved from geoCache
    fireEvent.click(fetchLiveBtn);
    await waitFor(() => {
      expect(aqiCallCount).toBe(2);
    });
    expect(geocodingCallCount).toBe(1); // Unchanged! Cached.

    // 3. Complete Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(await screen.findByText(/Step 2: Dwelling & Vulnerability Profile/i)).toBeInTheDocument();

    const pregnantChip = screen.getByRole('checkbox', { name: /Pregnant/i });
    expect(pregnantChip).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(pregnantChip);
    expect(pregnantChip).toHaveAttribute('aria-checked', 'true');

    // 4. Complete Step 2 -> Step 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(await screen.findByText(/Step 3: Commute & Home Setup/i)).toBeInTheDocument();

    // 5. Generate Smog Action Plan
    fireEvent.click(screen.getByRole('button', { name: /Generate Smog Action Plan/i }));

    // 6. Verify Dashboard renders with choice metrics & timelines
    await waitFor(() => {
      expect(screen.getByText(/Direct Choice Impact Simulator/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Targeted Smog Defense Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/Hourly Inversion & Safe Ventilation Schedule/i)).toBeInTheDocument();

    // 7. Verify LocalStorage persistence
    const savedRaw = window.localStorage.getItem('aeroguard_state_v1');
    expect(savedRaw).not.toBeNull();
    const parsedState = JSON.parse(savedRaw!);
    expect(parsedState.hasCompletedOnboarding).toBe(true);
    expect(parsedState.profile.city).toBe('Noida');
    expect(parsedState.profile.outdoorAqi).toBe(285);
    expect(parsedState.activePlan).toBeDefined();

    // 8. Remount App fresh: Plan must be restored without onboarding wizard
    unmount();
    render(<App />);

    expect(screen.getByText(/Direct Choice Impact Simulator/i)).toBeInTheDocument();
    expect(screen.queryByText(/Step 1: Location & Smog Severity/i)).not.toBeInTheDocument();

    // 9. Click "Edit Profile": Onboarding wizard resumes smoothly
    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editBtn);

    expect(screen.getByText(/Step 1: Location & Smog Severity/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Noida')).toBeInTheDocument();
  });
});
