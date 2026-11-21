import { HouseholdProfile, ImpactMetrics, SmogActionItem } from '../types/airQuality';
import { IMPACT_CALC_FACTORS } from '../constants/airQualityConstants';

/**
 * Pure mathematical functions computing household health and environmental impact
 * based on active SmogActionItem[] and HouseholdProfile parameters.
 */
export function calculateImpactMetrics(
  profile: HouseholdProfile,
  actions: readonly SmogActionItem[]
): ImpactMetrics {
  const activeActions = actions.filter((a) => a.enabled);

  // Baseline inhaled PM2.5 calculation based on EPA/WHO particulate exposure models:
  // Typical adult resting inhalation volume: ~12-14 m³/day.
  // In unsealed homes, indoor/outdoor ratio is ~0.65.
  const aqiRatio = Math.max(0, profile.outdoorAqi);
  const baselineConcentration = aqiRatio * IMPACT_CALC_FACTORS.CONCENTRATION_FACTOR;

  // Vulnerability multiplier: Children, seniors, and asthmatic members experience
  // higher effective dose deposition and respiratory sensitivity.
  const hasVulnerable = profile.vulnerabilities.some((v) =>
    ['children', 'seniors', 'asthma_respiratory', 'pregnant'].includes(v)
  );
  const vulnerabilityMultiplier = hasVulnerable
    ? IMPACT_CALC_FACTORS.VULNERABILITY_MULTIPLIER
    : 1.0;

  // Gear baseline attenuation
  const gearFactor =
    profile.cleanAirGear === 'hepaPurifier'
      ? 0.55
      : profile.cleanAirGear === 'diyBoxFan'
        ? 0.75
        : profile.cleanAirGear === 'n95Masks'
          ? 0.85
          : 1.0;

  const baselineDailyPm25Ug = Math.round(
    baselineConcentration *
      IMPACT_CALC_FACTORS.INHALATION_VOLUME_FACTOR *
      vulnerabilityMultiplier *
      gearFactor
  );

  // Sum active actions' PM2.5 reduction
  const rawPm25Saved = activeActions.reduce(
    (acc, action) => acc + (action.pm25ReductionUg || 0),
    0
  );

  // Maximum physiological reduction capped at 85% of baseline (residual infiltration)
  const maxPossibleReduction = Math.round(
    baselineDailyPm25Ug * IMPACT_CALC_FACTORS.PHYSIOLOGICAL_REDUCTION_CAP_RATIO
  );
  const dailyPm25SavedUg = Math.min(rawPm25Saved, maxPossibleReduction);

  const pm25ReductionPercent =
    baselineDailyPm25Ug > 0
      ? Math.min(
          IMPACT_CALC_FACTORS.PHYSIOLOGICAL_REDUCTION_CAP_PERCENT,
          Math.round((dailyPm25SavedUg / baselineDailyPm25Ug) * 100)
        )
      : 0;

  // Carbon savings calculation scaled by household members:
  // Formula: base_action_co2 * (1 + (householdSize - 1) * 0.45)
  const rawCo2 = activeActions.reduce(
    (acc, action) => acc + (action.weeklyCo2SavedKg || 0),
    0
  );
  const householdScale =
    1 + Math.max(0, profile.householdSize - 1) * IMPACT_CALC_FACTORS.CO2_HOUSEHOLD_SCALE;
  const weeklyCo2SavedKg = Number((rawCo2 * householdScale).toFixed(1));

  // Protection Score (0-100):
  // Baseline gear gives up to 30 points; active mitigation gives up to 70 points.
  const gearScore =
    profile.cleanAirGear === 'hepaPurifier'
      ? 30
      : profile.cleanAirGear === 'diyBoxFan'
        ? 20
        : profile.cleanAirGear === 'n95Masks'
          ? 15
          : 5;

  const maxActionReduction = Math.max(1, maxPossibleReduction);
  const mitigationScore = Math.min(
    70,
    Math.round((dailyPm25SavedUg / maxActionReduction) * 70)
  );
  const protectionScore = Math.min(100, gearScore + mitigationScore);

  return {
    baselineDailyPm25Ug,
    dailyPm25ReductionUgm3: dailyPm25SavedUg,
    pm25ReductionPercent,
    weeklyCo2SavedKg,
    protectionScore,
  };
}
