import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLiveCityAqi } from '../../src/services/liveAqiService';

describe('liveAqiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully fetches and parses live geocoding and AQI telemetry', async () => {
    const mockGeoResponse = {
      results: [
        {
          name: 'Delhi',
          latitude: 28.65,
          longitude: 77.23,
          country: 'India',
        },
      ],
    };

    const mockAqiResponse = {
      current: {
        us_aqi: 382,
        pm2_5: 298.4,
        pm10: 412.1,
        time: '2026-11-20T17:00',
      },
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('geocoding-api.open-meteo.com')) {
        return {
          ok: true,
          json: async () => mockGeoResponse,
        } as Response;
      }
      if (urlStr.includes('air-quality-api.open-meteo.com')) {
        return {
          ok: true,
          json: async () => mockAqiResponse,
        } as Response;
      }
      return { ok: false, status: 404 } as Response;
    });

    const result = await fetchLiveCityAqi('Delhi');

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(result.city).toBe('Delhi');
    expect(result.country).toBe('India');
    expect(result.aqi).toBe(382);
    expect(result.pm25).toBe(298.4);
    expect(result.pm10).toBe(412.1);
    expect(result.source).toBe('Open-Meteo Air Quality Network');
    expect(result.isLive).toBe(true);
  });

  it('throws descriptive error when geocoding finds no matching city', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      return {
        ok: true,
        json: async () => ({ results: [] }),
      } as Response;
    });

    await expect(fetchLiveCityAqi('NonexistentCityXYZ')).rejects.toThrow(
      /Location "NonexistentCityXYZ" not found/
    );
  });

  it('throws when city name is too short or blank', async () => {
    await expect(fetchLiveCityAqi(' ')).rejects.toThrow(
      /City name must contain at least 2 characters/
    );
    await expect(fetchLiveCityAqi('A')).rejects.toThrow(
      /City name must contain at least 2 characters/
    );
  });

  it('sanitizes input before building query URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('geocoding-api.open-meteo.com')) {
        return {
          ok: true,
          json: async () => ({
            results: [{ name: 'Noida', latitude: 28.53, longitude: 77.39, country: 'India' }],
          }),
        } as Response;
      }
      return {
        ok: true,
        json: async () => ({
          current: { us_aqi: 210, pm2_5: 140, pm10: 190 },
        }),
      } as Response;
    });

    // Contains injection tokens and control chars
    await fetchLiveCityAqi('Noida\x00\x1B```user:');
    const calledUrl = String(fetchSpy.mock.calls[0]?.[0]);
    expect(calledUrl).toContain('name=Noida');
    expect(calledUrl).not.toContain('%00');
    expect(calledUrl).not.toContain('```');
  });
});
