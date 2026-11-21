/**
 * Canonical centralized constants for AeroGuard AI domain models, validation,
 * math formulas, Gemini failover models, and external API endpoints.
 */

export const STORAGE_KEY = 'aeroguard_state_v1';

export const GEMINI_MODEL_CHAIN = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
] as const;

export const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
export const OPEN_METEO_AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const AQI_THRESHOLDS = {
  GOOD_MAX: 50,
  MODERATE_MAX: 100,
  POOR_MAX: 200,
  SEVERE_MAX: 300,
} as const;

export const IMPACT_CALC_FACTORS = {
  VULNERABILITY_MULTIPLIER: 1.25,
  CO2_HOUSEHOLD_SCALE: 0.45,
  PHYSIOLOGICAL_REDUCTION_CAP_PERCENT: 85,
  PHYSIOLOGICAL_REDUCTION_CAP_RATIO: 0.85,
  CONCENTRATION_FACTOR: 0.73,
  INHALATION_VOLUME_FACTOR: 12.5,
} as const;

export const INPUT_BOUNDS = {
  CITY_MIN_CHARS: 2,
  CITY_MAX_CHARS: 50,
  AQI_MIN: 0,
  AQI_MAX: 999,
  HOUSEHOLD_SIZE_MIN: 1,
  HOUSEHOLD_SIZE_MAX: 20,
} as const;
