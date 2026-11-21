import { LiveAqiReading } from '../types/airQuality';
import { sanitizePromptInput } from '../utils/sanitizers';
import { fetchJsonWithTimeout } from '../utils/httpClient';
import {
  OPEN_METEO_GEOCODING_URL,
  OPEN_METEO_AIR_QUALITY_URL,
  INPUT_BOUNDS,
} from '../constants/airQualityConstants';

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

const HTTP_TIMEOUT_MS = 8000;

/**
 * Keyless real-time air quality telemetry fetcher for cities across India and globally.
 * Uses Open-Meteo Geocoding & Open-Meteo Air Quality APIs.
 */
export async function fetchLiveCityAqi(cityName: string): Promise<LiveAqiReading> {
  const cleanCity = sanitizePromptInput(cityName, 60);
  if (!cleanCity || cleanCity.length < INPUT_BOUNDS.CITY_MIN_CHARS) {
    throw new Error(`City name must contain at least ${INPUT_BOUNDS.CITY_MIN_CHARS} characters.`);
  }

  // 1. Resolve geographic coordinates
  const geoUrl = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(
    cleanCity
  )}&count=1&language=en&format=json`;

  const geoData = await fetchJsonWithTimeout<GeocodingApiResponse>(geoUrl, HTTP_TIMEOUT_MS);
  const firstMatch = geoData.results?.[0];

  if (!firstMatch || typeof firstMatch.latitude !== 'number' || typeof firstMatch.longitude !== 'number') {
    throw new Error(`Location "${cleanCity}" not found. Please verify spelling.`);
  }

  const { latitude, longitude, name: resolvedCity, country = 'India' } = firstMatch;

  // 2. Fetch live atmospheric particulate telemetry
  const aqiUrl = `${OPEN_METEO_AIR_QUALITY_URL}?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10`;

  const aqiData = await fetchJsonWithTimeout<AirQualityApiResponse>(aqiUrl, HTTP_TIMEOUT_MS);
  const current = aqiData.current;

  if (!current || typeof current.us_aqi !== 'number') {
    throw new Error(`Telemetry unavailable for "${cleanCity}".`);
  }

  const roundedAqi = Math.max(
    INPUT_BOUNDS.AQI_MIN,
    Math.min(INPUT_BOUNDS.AQI_MAX, Math.round(current.us_aqi))
  );

  return {
    city: resolvedCity,
    country,
    aqi: roundedAqi,
    pm25: typeof current.pm2_5 === 'number' ? current.pm2_5 : 0,
    pm10: typeof current.pm10 === 'number' ? current.pm10 : 0,
    source: 'Open-Meteo Air Quality Network',
    fetchedAt: current.time ?? new Date().toISOString(),
    isLive: true,
  };
}
