import { LiveAqiReading } from '../types/airQuality';
import { sanitizePromptInput } from '../utils/sanitizers';

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

interface GeocodingApiResponse {
  results?: GeocodingResult[];
}

interface AirQualityApiResponse {
  current?: {
    us_aqi?: number;
    pm2_5?: number;
    pm10?: number;
    time?: string;
  };
}

/**
 * Keyless real-time air quality telemetry fetcher for cities across India and globally.
 * Uses Open-Meteo Geocoding & Open-Meteo Air Quality APIs.
 */
export async function fetchLiveCityAqi(cityName: string): Promise<LiveAqiReading> {
  const cleanCity = sanitizePromptInput(cityName, 60);
  if (!cleanCity || cleanCity.length < 2) {
    throw new Error('City name must contain at least 2 characters.');
  }

  // 1. Resolve geographic coordinates
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cleanCity
  )}&count=1&language=en&format=json`;

  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) {
    throw new Error(`Geocoding failed with status ${geoRes.status}`);
  }

  const geoData = (await geoRes.json()) as GeocodingApiResponse;
  const firstMatch = geoData.results?.[0];

  if (!firstMatch || typeof firstMatch.latitude !== 'number' || typeof firstMatch.longitude !== 'number') {
    throw new Error(`Location "${cleanCity}" not found. Please verify spelling.`);
  }

  const { latitude, longitude, name: resolvedCity, country = 'India' } = firstMatch;

  // 2. Fetch live atmospheric particulate telemetry
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10`;

  const aqiRes = await fetch(aqiUrl);
  if (!aqiRes.ok) {
    throw new Error(`Air quality API failed with status ${aqiRes.status}`);
  }

  const aqiData = (await aqiRes.json()) as AirQualityApiResponse;
  const current = aqiData.current;

  if (!current || typeof current.us_aqi !== 'number') {
    throw new Error(`Telemetry unavailable for "${cleanCity}".`);
  }

  const roundedAqi = Math.max(0, Math.min(999, Math.round(current.us_aqi)));
  const pm25Val = typeof current.pm2_5 === 'number' ? Math.round(current.pm2_5 * 10) / 10 : 0;
  const pm10Val = typeof current.pm10 === 'number' ? Math.round(current.pm10 * 10) / 10 : 0;

  return {
    city: resolvedCity || cleanCity,
    country,
    aqi: roundedAqi,
    pm25: pm25Val,
    pm10: pm10Val,
    source: 'Open-Meteo Air Quality Network',
    fetchedAt: new Date().toISOString(),
    isLive: true,
  };
}
