/**
 * Strict domain models for AeroGuard AI
 * Defined according to docs/DATABASE.md, docs/API.md, and docs/PRD.md
 */

export type AqiSeverity = 'good' | 'moderate' | 'poor' | 'severe' | 'hazardous';

export type VulnerabilityGroup =
  | 'children'
  | 'seniors'
  | 'asthma_respiratory'
  | 'pregnant'
  | 'none';

export type CommuteMode =
  | 'private_car'
  | 'two_wheeler'
  | 'public_metro_bus'
  | 'walk_cycle'
  | 'work_from_home';

export type CookingFuel =
  | 'lpg_gas'
  | 'induction_electric'
  | 'biomass_solid';

export type ActionCategory =
  | 'low_emission_routine'
  | 'iaq_hack'
  | 'sustainable_alternative';

export type CostLevel = 'free' | 'low' | 'moderate';
export type DifficultyLevel = 'easy' | 'medium';
export type CleanAirGear = 'none' | 'n95Masks' | 'diyBoxFan' | 'hepaPurifier';
export type HomeType = 'apartment' | 'standalone' | 'highRise';
export type VentilationRiskLevel = 'lockdown' | 'caution' | 'safe';
export type AmbientAqiTrend = 'peaking' | 'rising' | 'moderate' | 'falling';

export interface HouseholdProfile {
  city: string;
  outdoorAqi: number;
  householdSize: number;
  vulnerabilities: VulnerabilityGroup[];
  homeType: HomeType;
  commuteMode: CommuteMode;
  cleanAirGear: CleanAirGear;
  cookingFuel: CookingFuel;
  updatedAt: string;
}

export interface ImpactMetrics {
  baselineDailyPm25Ug: number;
  dailyPm25ReductionUgm3: number;
  pm25ReductionPercent: number;
  weeklyCo2SavedKg: number;
  protectionScore: number;
}

export interface SmogActionItem {
  id: string;
  title: string;
  category: ActionCategory;
  steps: string[];
  costLevel: CostLevel;
  difficulty: DifficultyLevel;
  scientificRationale: string;
  pm25ReductionUg: number;
  weeklyCo2SavedKg: number;
  enabled: boolean;
}

export interface VentilationWindow {
  hourRange: string;
  riskLevel: VentilationRiskLevel;
  title: string;
  instruction: string;
  ambientAqiTrend: AmbientAqiTrend;
}

export interface AirQualityPlan {
  planId: string;
  city: string;
  baselineOutdoorAqi: number;
  severityLabel: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe' | 'Hazardous';
  generatedAt: string;
  isOfflineFallback: boolean;
  summaryHeadline: string;
  actions: SmogActionItem[];
  ventilationTimeline: VentilationWindow[];
  communityAdvisoryText: string;
}

export interface PersistedAppState {
  version: 1;
  profile: HouseholdProfile;
  activePlan: AirQualityPlan | null;
  selectedActionIds: string[];
  hasCompletedOnboarding: boolean;
  lastSyncTimestamp: number;
}

export interface SmogPreset {
  id: string;
  label: string;
  city: string;
  aqi: number;
  description: string;
  severity: AqiSeverity;
}
