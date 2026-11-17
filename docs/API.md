# API Contract Specification — Google Gemini 2.5 Flash & AeroGuard AI

## 1. Overview & Conventions
- **Provider:** Google Generative AI (`@google/generative-ai` SDK)
- **Model:** `gemini-2.5-flash`
- **Output Mode:** Guaranteed structured JSON via `responseMimeType: "application/json"`.
- **Latency Target:** <2.0 seconds.
- **Client Execution:** Client-side invocation in `src/services/geminiService.ts`.
- **Fallback Strategy:** Immediate deterministic fallback to `src/services/fallbackSmogPlan.ts` upon timeout (>5000ms), 429 rate limit, network failure, or invalid JSON payload.

---

## 2. Request Configuration Contract

```typescript
export interface GeminiRequestConfig {
  model: 'gemini-2.5-flash';
  generationConfig: {
    temperature: 0.2; // Low temperature for factual, deterministic environmental guidance
    topP: 0.8;
    maxOutputTokens: 2048;
    responseMimeType: 'application/json';
  };
  systemInstruction: string;
}
```

### System Instruction Guardrail
```text
You are AeroGuard AI, an expert environmental health scientist and urban air quality advisor specializing in winter smog mitigation, DIY particulate filtration, and community resilience.
You generate hyper-localized, actionable, low-cost smog defense plans tailored to the user's city, current outdoor AQI, vulnerable household members, commute mode, and heating infrastructure.
You must always output strictly valid JSON conforming exactly to the requested schema. Do not output markdown fences (no ```json). Do not include pleasantries, conversational text, or extraneous commentary.
```

---

## 3. Request Prompt Contract & Payload Template
The user prompt is constructed deterministically from the sanitized `HouseholdProfile`:

```typescript
export function buildSmogPlanPrompt(profile: HouseholdProfile): string {
  return `Generate an urban winter smog defense plan conforming to the required JSON schema for the following household:
- Location / City: "${profile.city}"
- Current Outdoor AQI: ${profile.outdoorAqi}
- Vulnerabilities: Children=${profile.vulnerableGroups.hasChildren}, Seniors=${profile.vulnerableGroups.hasSeniors}, RespiratorySensitivity=${profile.vulnerableGroups.hasRespiratorySensitivity}, Pregnancy=${profile.vulnerableGroups.hasPregnancy}
- Home Type: ${profile.homeType}
- Daily Commute Mode: ${profile.commuteMode}
- Current Clean Air Gear: ${profile.cleanAirGear}
- Primary Cooking/Heating Fuel: ${profile.cookingFuel}

Provide between 6 and 9 highly prioritized actionable mitigation strategies evenly distributed across:
1. "routines" (Low-Emission Daily Routines)
2. "indoorHacks" (Indoor Air Quality Hacks, prioritizing DIY and low-cost methods like Corsi-Rosenthal boxes, wet door seals)
3. "sustainableAlternatives" (Sustainable community & commute alternatives)

Include a 4-period daily ventilation schedule (morning, midday, evening, night) detailing thermal inversion hazards, and a 1-page community advisory statement.`;
}
```

---

## 4. Expected JSON Response Schema (`AirQualityPlan`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AirQualityPlan",
  "type": "object",
  "required": [
    "planId",
    "city",
    "baselineOutdoorAqi",
    "severityLabel",
    "summaryHeadline",
    "actions",
    "ventilationTimeline",
    "communityAdvisoryText"
  ],
  "properties": {
    "planId": { "type": "string" },
    "city": { "type": "string" },
    "baselineOutdoorAqi": { "type": "number", "minimum": 0, "maximum": 999 },
    "severityLabel": {
      "type": "string",
      "enum": ["Good", "Moderate", "Poor", "Very Poor", "Severe"]
    },
    "summaryHeadline": { "type": "string" },
    "actions": {
      "type": "array",
      "minItems": 6,
      "maxItems": 12,
      "items": {
        "type": "object",
        "required": [
          "id",
          "title",
          "category",
          "steps",
          "costLevel",
          "difficulty",
          "scientificRationale",
          "impactEstimates"
        ],
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "category": {
            "type": "string",
            "enum": ["routines", "indoorHacks", "sustainableAlternatives"]
          },
          "steps": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 2,
            "maxItems": 4
          },
          "costLevel": {
            "type": "string",
            "enum": ["free", "low", "moderate"]
          },
          "difficulty": {
            "type": "string",
            "enum": ["easy", "medium"]
          },
          "scientificRationale": { "type": "string" },
          "impactEstimates": {
            "type": "object",
            "required": [
              "dailyPm25ReductionUgm3",
              "pm25ReductionPercent",
              "weeklyCo2SavedKg"
            ],
            "properties": {
              "dailyPm25ReductionUgm3": { "type": "number", "minimum": 0 },
              "pm25ReductionPercent": { "type": "number", "minimum": 0, "maximum": 100 },
              "weeklyCo2SavedKg": { "type": "number", "minimum": 0 }
            }
          }
        }
      }
    },
    "ventilationTimeline": {
      "type": "array",
      "minItems": 3,
      "maxItems": 5,
      "items": {
        "type": "object",
        "required": ["hourRange", "riskLevel", "title", "instruction", "ambientAqiTrend"],
        "properties": {
          "hourRange": { "type": "string" },
          "riskLevel": { "type": "string", "enum": ["lockdown", "caution", "safe"] },
          "title": { "type": "string" },
          "instruction": { "type": "string" },
          "ambientAqiTrend": { "type": "string", "enum": ["peaking", "rising", "moderate", "falling"] }
        }
      }
    },
    "communityAdvisoryText": { "type": "string" }
  }
}
```

---

## 5. Concrete Response Payload Example
```json
{
  "planId": "plan-delhi-ncr-420-1731852000",
  "city": "Delhi NCR",
  "baselineOutdoorAqi": 420,
  "severityLabel": "Severe",
  "summaryHeadline": "Emergency winter inversion alert: Enforce indoor clean air sanctuary and restrict early morning exposure.",
  "actions": [
    {
      "id": "corsi-rosenthal-diy-air-cleaner",
      "title": "Build DIY Corsi-Rosenthal Box Purifier",
      "category": "indoorHacks",
      "steps": [
        "Tape four MERV-13 furnace filters (20x20) into a cube around a standard box fan.",
        "Seal the bottom with cardboard and secure all corners with duct tape.",
        "Run on medium speed in the main bedroom or living room."
      ],
      "costLevel": "low",
      "difficulty": "easy",
      "scientificRationale": "Achieves clean air delivery rate (CADR) equivalent to $500 commercial HEPA purifiers, filtering 85% of sub-micron particles with zero ozone production.",
      "impactEstimates": {
        "dailyPm25ReductionUgm3": 85,
        "pm25ReductionPercent": 45,
        "weeklyCo2SavedKg": 1.2
      }
    },
    {
      "id": "staggered-commute-n95",
      "title": "Shift Commute Window & Wear Dual-Strap N95",
      "category": "routines",
      "steps": [
        "Avoid traveling during peak thermal trapping hours (07:00-09:30 AM).",
        "Ensure airtight seal with certified N95/FFP2 mask over nose and chin."
      ],
      "costLevel": "free",
      "difficulty": "easy",
      "scientificRationale": "Shifting commute away from morning peak cuts particulate inhalation by 35%; N95 seals block 95% of inhaled fine particulates.",
      "impactEstimates": {
        "dailyPm25ReductionUgm3": 68,
        "pm25ReductionPercent": 32,
        "weeklyCo2SavedKg": 0.0
      }
    },
    {
      "id": "induction-cooking-transition",
      "title": "Shift to Electric Induction Cooking During Inversions",
      "category": "sustainableAlternatives",
      "steps": [
        "Use electric induction burner for boiling and daily meals during peak smog weeks.",
        "Avoid unvented gas burner usage which emits NO2, ultrafine particles, and CO inside sealed rooms."
      ],
      "costLevel": "low",
      "difficulty": "easy",
      "scientificRationale": "Eliminates combustion emissions indoors, preventing spikes in nitrogen dioxide (NO2) and indoor ultrafine particles.",
      "impactEstimates": {
        "dailyPm25ReductionUgm3": 35,
        "pm25ReductionPercent": 18,
        "weeklyCo2SavedKg": 4.8
      }
    }
  ],
  "ventilationTimeline": [
    {
      "hourRange": "05:00 AM - 09:30 AM",
      "riskLevel": "lockdown",
      "title": "Morning Inversion Peak",
      "instruction": "Severe ground-level pollutant trapping. Seal all exterior doors and windows.",
      "ambientAqiTrend": "peaking"
    },
    {
      "hourRange": "01:00 PM - 03:00 PM",
      "riskLevel": "safe",
      "title": "Solar Mixing Window",
      "instruction": "Solar heating temporarily lifts boundary layer. Safe for 15-minute cross-ventilation to clear indoor CO2.",
      "ambientAqiTrend": "falling"
    },
    {
      "hourRange": "06:00 PM - 10:00 PM",
      "riskLevel": "lockdown",
      "title": "Evening Commute Smog Surge",
      "instruction": "Particulates condense as ground cools. Keep indoor air scrubbers on maximum setting.",
      "ambientAqiTrend": "rising"
    }
  ],
  "communityAdvisoryText": "COMMUNITY SMOG ADVISORY — Severe Air Quality Alert (AQI 420). All outdoor sports, morning assemblies, and recess are suspended. Keep classroom windows closed. Children and asthmatic residents must wear N95 masks when outdoors. Avoid diesel generator usage."
}
```

---

## 6. Error Handling & Timeout Recovery Contract
The API client adheres to a strict 3-tier fallback hierarchy:

```
[ Request Gemini 2.5 Flash ]
            |
            |-- (Timeout >5000ms OR HTTP 429/500 OR Network Offline)
            |
            v
[ Intercept Error in Service Layer ]
            |
            v
[ Invoke fallbackSmogPlan(profile) ]
            |
            v
[ Return Valid AirQualityPlan with isOfflineFallback: true ]
            |
            v
[ Render Complete UI with Informational Fallback Badge ]
```

---

## 7. Contract Test Cases (`tests/services/geminiService.test.ts`)
1. **Contract Schema Conformance:** Validates that the sample API response satisfies `isValidAirQualityPlan(response) === true`.
2. **Missing Properties Guard:** Validates that dropping `actions` or `ventilationTimeline` causes the validator to return `false`.
3. **Timeout Abort:** Verifies that an unfulfilled promise after 5000ms triggers the fallback generator without throwing an unhandled rejection.
4. **Offline Resilience:** Verifies that when `window.navigator.onLine === false`, the API call is skipped entirely and `fallbackSmogPlan` returns within <5ms.

