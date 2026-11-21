import {
  AirQualityPlan,
  HouseholdProfile,
  SmogPreset,
  VentilationWindow,
} from '../types/airQuality';
import { classifyAqiSeverity } from '../utils/validators';
import { getFallbackActions } from './fallbackActions';

export const SMOG_PRESETS: readonly SmogPreset[] = [
  {
    id: 'delhi-severe-smog',
    label: 'Delhi / NCR Severe Winter Smog',
    city: 'Delhi NCR',
    aqi: 420,
    description: 'Catastrophic post-harvest agricultural smoke & winter inversion.',
    severity: 'hazardous',
  },
  {
    id: 'mumbai-coastal-haze',
    label: 'Mumbai / Coastal Urban Haze',
    city: 'Mumbai',
    aqi: 165,
    description: 'High humidity vehicle emissions & infrastructure particulate dust.',
    severity: 'poor',
  },
  {
    id: 'indo-gangetic-inversion',
    label: 'Indo-Gangetic Morning Inversion',
    city: 'Kanpur / Patna',
    aqi: 310,
    description: 'Dense cold river-basin particulate layer trapping surface smoke.',
    severity: 'severe',
  },
];

function buildFallbackTimeline(aqi: number): VentilationWindow[] {
  const isSevere = aqi >= 250;
  return [
    {
      hourRange: '05:00 AM - 09:30 AM',
      riskLevel: 'lockdown',
      title: 'Early Morning Radiation Inversion',
      instruction:
        'Pollutants compressed against ground level. Keep all windows hermetically sealed.',
      ambientAqiTrend: 'peaking',
    },
    {
      hourRange: '12:30 PM - 03:00 PM',
      riskLevel: isSevere ? 'caution' : 'safe',
      title: 'Solar Thermal Boundary Expansion',
      instruction:
        'Solar heating temporarily dilutes surface pollutants. 10-15 min cross-ventilation permitted to purge CO2.',
      ambientAqiTrend: 'falling',
    },
    {
      hourRange: '06:00 PM - 09:30 PM',
      riskLevel: 'lockdown',
      title: 'Evening Rush Hour & Surface Cooling Spike',
      instruction:
        'Vehicular exhaust trapped as atmospheric boundary collapses. Seal exterior thresholds.',
      ambientAqiTrend: 'rising',
    },
    {
      hourRange: '10:00 PM - 05:00 AM',
      riskLevel: 'caution',
      title: 'Overnight Stagnation Window',
      instruction:
        'Maintain bedroom door closure and operate internal air scrubber on low whisper mode.',
      ambientAqiTrend: 'moderate',
    },
  ];
}

/**
 * Generates an expert-calibrated deterministic air quality action plan offline.
 * @param profile - User household parameters and outdoor AQI level.
 * @returns Complete AirQualityPlan guaranteed to satisfy domain type guards.
 */
export function generateFallbackSmogPlan(profile: HouseholdProfile): AirQualityPlan {
  const severity = classifyAqiSeverity(profile.outdoorAqi);
  const severityLabelMap = {
    good: 'Good',
    moderate: 'Moderate',
    poor: 'Poor',
    severe: 'Severe',
    hazardous: 'Hazardous',
  } as const;

  return {
    planId: `plan-${profile.city.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
    city: profile.city || 'Delhi NCR',
    baselineOutdoorAqi: profile.outdoorAqi,
    severityLabel: severityLabelMap[severity],
    generatedAt: new Date().toISOString(),
    isOfflineFallback: true,
    summaryHeadline: `Calibrated smog defense protocol active for ${profile.city} (AQI ${profile.outdoorAqi}). Prioritizing indoor particle containment and peak-hour avoidance.`,
    actions: getFallbackActions(profile.outdoorAqi >= 250),
    ventilationTimeline: buildFallbackTimeline(profile.outdoorAqi),
    communityAdvisoryText: `COMMUNITY SMOG ADVISORY: ${profile.city} is experiencing ${severity.toUpperCase()} air quality (AQI ${profile.outdoorAqi}). Restrict morning outdoor exertion. Keep school and residence windows sealed during early hours. Open leaf burning is strictly prohibited.`,
  };
}
