import {
  AqiSeverity,
  HouseholdProfile,
  CommuteMode,
  CookingFuel,
  HomeType,
  CleanAirGear,
} from '../types/airQuality';

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

export function classifyAqiSeverity(aqi: number): AqiSeverity {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'poor';
  if (aqi <= 300) return 'severe';
  return 'hazardous';
}

export interface ValidationErrors {
  [field: string]: string;
}

export function validateProfileStep1(
  data: Pick<HouseholdProfile, 'city' | 'outdoorAqi' | 'householdSize'>
): ValidationErrors {
  const errors: ValidationErrors = {};
  const city = data.city ? data.city.trim() : '';

  if (!city || city.length < 2) {
    errors.city = 'City name must be at least 2 characters.';
  } else if (city.length > 50) {
    errors.city = 'City name cannot exceed 50 characters.';
  }

  if (typeof data.outdoorAqi !== 'number' || Number.isNaN(data.outdoorAqi)) {
    errors.outdoorAqi = 'AQI must be a valid number.';
  } else if (data.outdoorAqi < 0 || data.outdoorAqi > 999) {
    errors.outdoorAqi = 'AQI must be between 0 and 999.';
  }

  if (typeof data.householdSize !== 'number' || Number.isNaN(data.householdSize)) {
    errors.householdSize = 'Household size must be a number.';
  } else if (data.householdSize < 1 || data.householdSize > 20) {
    errors.householdSize = 'Household size must be between 1 and 20 members.';
  }

  return errors;
}

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
