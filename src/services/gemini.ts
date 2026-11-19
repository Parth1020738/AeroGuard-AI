import { GoogleGenerativeAI } from '@google/generative-ai';
import { AirQualityPlan, HouseholdProfile } from '../types/airQuality';
import { sanitizePromptInput, isValidAirQualityPlan } from '../utils/sanitizers';
import { generateFallbackSmogPlan } from './fallbackSmogPlan';

// Failover model chain: Most economical flash-lite first, then standard flash, then latest flash
const MODEL_FAILOVER_CHAIN = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
];

function buildPlanPrompt(profile: HouseholdProfile): string {
  const city = sanitizePromptInput(profile.city, 40) || 'Delhi NCR';
  const aqi = Math.max(0, Math.min(999, profile.outdoorAqi));
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

export async function fetchAirQualityPlan(
  profile: HouseholdProfile
): Promise<AirQualityPlan> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return generateFallbackSmogPlan(profile);
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());
  const prompt = buildPlanPrompt(profile);

  for (const modelName of MODEL_FAILOVER_CHAIN) {
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
      const parsed: unknown = JSON.parse(text);

      if (isValidAirQualityPlan(parsed)) {
        return {
          ...parsed,
          isOfflineFallback: false,
        };
      }
    } catch (error) {
      console.warn(`[gemini] Model "${modelName}" failed or unparseable, trying next:`, error);
    }
  }

  // If all models in the chain fail, seamlessly return deterministic plan
  return generateFallbackSmogPlan(profile);
}
