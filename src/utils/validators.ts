import {
  AqiSeverity,
  HouseholdProfile,
  CommuteMode,
  CookingFuel,
  HomeType,
  CleanAirGear,
} from '../types/airQuality';
import { AQI_THRESHOLDS, INPUT_BOUNDS } from '../constants/airQualityConstants';

const VALID_COMMUTES = new Set<CommuteMode>([
  'private_car',
  'two_wheeler',
  'public_metro_bus',
  'walk_cycle',
  'work_from_home',
]);

const VALID_FUELS = new Set<CookingFuel>([
  'lpg_gas',
  'induction_electric',
  'biomass_solid',
]);

const VALID_HOMES = new Set<HomeType>(['apartment', 'standalone', 'highRise']);
const VALID_GEAR = new Set<CleanAirGear>(['none', 'n95Masks', 'diyBoxFan', 'hepaPurifier']);

/**
 * Classifies numeric AQI into health risk severity category.
 * @param aqi - Numerical Air Quality Index value.
 * @returns AqiSeverity union ('good' | 'moderate' | 'poor' | 'severe' | 'hazardous').
 */
export function classifyAqiSeverity(aqi: number): AqiSeverity {
  if (aqi <= AQI_THRESHOLDS.GOOD_MAX) return 'good';
  if (aqi <= AQI_THRESHOLDS.MODERATE_MAX) return 'moderate';
  if (aqi <= AQI_THRESHOLDS.POOR_MAX) return 'poor';
  if (aqi <= AQI_THRESHOLDS.SEVERE_MAX) return 'severe';
  return 'hazardous';
}

export interface ValidationErrors {
  [field: string]: string;
}

/**
 * Validates step 1 inputs (city name, outdoor AQI, household size).
 * @param data - Step 1 form fields.
 * @returns Record of validation error messages keyed by field name.
 */
export function validateProfileStep1(
  data: Pick<HouseholdProfile, 'city' | 'outdoorAqi' | 'householdSize'>
): ValidationErrors {
  const errors: ValidationErrors = {};
  const city = data.city ? data.city.trim() : '';

  if (!city || city.length < INPUT_BOUNDS.CITY_MIN_CHARS) {
    errors.city = `City name must be at least ${INPUT_BOUNDS.CITY_MIN_CHARS} characters.`;
  } else if (city.length > INPUT_BOUNDS.CITY_MAX_CHARS) {
    errors.city = `City name cannot exceed ${INPUT_BOUNDS.CITY_MAX_CHARS} characters.`;
  }

  if (typeof data.outdoorAqi !== 'number' || Number.isNaN(data.outdoorAqi)) {
    errors.outdoorAqi = 'AQI must be a valid number.';
  } else if (data.outdoorAqi < INPUT_BOUNDS.AQI_MIN || data.outdoorAqi > INPUT_BOUNDS.AQI_MAX) {
    errors.outdoorAqi = `AQI must be between ${INPUT_BOUNDS.AQI_MIN} and ${INPUT_BOUNDS.AQI_MAX}.`;
  }

  if (typeof data.householdSize !== 'number' || Number.isNaN(data.householdSize)) {
    errors.householdSize = 'Household size must be a number.';
  } else if (
    data.householdSize < INPUT_BOUNDS.HOUSEHOLD_SIZE_MIN ||
    data.householdSize > INPUT_BOUNDS.HOUSEHOLD_SIZE_MAX
  ) {
    errors.householdSize = `Household size must be between ${INPUT_BOUNDS.HOUSEHOLD_SIZE_MIN} and ${INPUT_BOUNDS.HOUSEHOLD_SIZE_MAX} members.`;
  }

  return errors;
}

/**
 * Validates step 2 inputs (home dwelling architecture and vulnerability list).
 * @param data - Step 2 form fields.
 * @returns Record of validation error messages keyed by field name.
 */
export function validateProfileStep2(
  data: Pick<HouseholdProfile, 'homeType' | 'vulnerabilities'>
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!VALID_HOMES.has(data.homeType)) {
    errors.homeType = 'Please select a valid home dwelling type.';
  }

  if (!Array.isArray(data.vulnerabilities)) {
    errors.vulnerabilities = 'Vulnerabilities must be an array.';
  }

  return errors;
}

/**
 * Validates step 3 inputs (commute mode, cooking fuel, and existing clean-air gear).
 * @param data - Step 3 form fields.
 * @returns Record of validation error messages keyed by field name.
 */
export function validateProfileStep3(
  data: Pick<HouseholdProfile, 'commuteMode' | 'cookingFuel' | 'cleanAirGear'>
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!VALID_COMMUTES.has(data.commuteMode)) {
    errors.commuteMode = 'Please select a valid daily commute mode.';
  }

  if (!VALID_FUELS.has(data.cookingFuel)) {
    errors.cookingFuel = 'Please select a valid cooking/heating fuel source.';
  }

  if (!VALID_GEAR.has(data.cleanAirGear)) {
    errors.cleanAirGear = 'Please select your current clean air gear.';
  }

  return errors;
}
