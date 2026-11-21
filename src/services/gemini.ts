import { GoogleGenerativeAI } from '@google/generative-ai';
import { AirQualityPlan, HouseholdProfile } from '../types/airQuality';
import { sanitizePromptInput, isValidAirQualityPlan } from '../utils/sanitizers';
import { safeParseJson } from '../utils/httpClient';
import { generateFallbackSmogPlan } from './fallbackSmogPlan';
import { GEMINI_MODEL_CHAIN, INPUT_BOUNDS } from '../constants/airQualityConstants';

function buildPlanPrompt(profile: HouseholdProfile): string {
  const city = sanitizePromptInput(profile.city, 40) || 'Delhi NCR';
  const aqi = Math.max(INPUT_BOUNDS.AQI_MIN, Math.min(INPUT_BOUNDS.AQI_MAX, profile.outdoorAqi));
  const vulnerabilities = profile.vulnerabilities.join(', ') || 'none';

  return `Generate an urban air quality action plan for:
City: "${city}", Outdoor AQI: ${aqi}, Household Size: ${profile.householdSize}, Vulnerabilities: [${vulnerabilities}], Dwelling: ${profile.homeType}, Commute: ${profile.commuteMode}, Fuel: ${profile.cookingFuel}, Gear: ${profile.cleanAirGear}.

Return strictly JSON matching this structure:
{
  "planId": "plan-${Date.now()}",
  "city": "${city}",
  "baselineOutdoorAqi": ${aqi},
  "severityLabel": "Severe",
  "summaryHeadline": "string",
  "communityAdvisoryText": "string",
  "actions": [
    {
      "id": "unique-slug",
      "title": "string",
      "category": "low_emission_routine" | "iaq_hack" | "sustainable_alternative",
      "steps": ["step 1", "step 2"],
      "costLevel": "free" | "low" | "moderate",
      "difficulty": "easy" | "medium",
      "scientificRationale": "string",
      "pm25ReductionUg": 350,
      "weeklyCo2SavedKg": 2.5,
      "enabled": true
    }
  ],
  "ventilationTimeline": [
    {
      "hourRange": "05:00 AM - 09:30 AM",
      "riskLevel": "lockdown" | "caution" | "safe",
      "title": "string",
      "instruction": "string",
      "ambientAqiTrend": "peaking" | "rising" | "moderate" | "falling"
    }
  ]
}
Include exactly 9 actions (3 per category) and 4 ventilationTimeline blocks. No markdown formatting.`;
}

/**
 * Synthesizes a personalized air quality plan via Gemini with automatic multi-model failover.
 * Falls back to deterministic offline plan if API key is absent, rate-limited, or network fails.
 * @param profile - Household demographics, vulnerabilities, and outdoor AQI.
 * @returns Validated AirQualityPlan matching the domain schema.
 */
export async function fetchAirQualityPlan(
  profile: HouseholdProfile
): Promise<AirQualityPlan> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return generateFallbackSmogPlan(profile);
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());
  const prompt = buildPlanPrompt(profile);

  for (const modelName of GEMINI_MODEL_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = safeParseJson<unknown>(text);

      if (isValidAirQualityPlan(parsed)) {
        return {
          ...parsed,
          isOfflineFallback: false,
        };
      }
    } catch {
      // Continue to next failover model in GEMINI_MODEL_CHAIN
      continue;
    }
  }

  return generateFallbackSmogPlan(profile);
}
