# Product Requirements Document — AeroGuard AI

## 1. Product Overview
- **Product Name:** AeroGuard AI
- **One-Line Description:** An intelligent GenAI urban air quality assistant that guides families and community organizers through severe winter smog with hyper-localized routines, indoor clean-air hacks, sustainable alternatives, and direct choice impact simulations.
- **Product Type:** Client-Side Web Application (Single Page Application)
- **Primary Platform:** Modern Responsive Web (Desktop, Tablet, Mobile)
- **Technology Core:** React 19, TypeScript (strict mode), Vite, Tailwind CSS v4, Google Gemini API (`gemini-2.5-flash`), Vitest, oxlint.

---

## 2. Problem
### What problem are we solving?
Urban populations in high-density industrial and geographical river-basin corridors (e.g., Indo-Gangetic Plains, Delhi/NCR, Lahore, Beijing, Ulaanbaatar, Salt Lake Valley) suffer catastrophic winter smog episodes where AQI routinely exceeds 300 to 500+ (PM2.5 concentrations exceeding 250–500 µg/m³).

### Why does this problem matter?
1. **Health Catastrophe:** Inhaling high PM2.5 levels causes acute respiratory distress, severe pediatric asthma attacks, cardiovascular inflammation, and irreversible pulmonary damage in seniors.
2. **Action Paralysis:** Existing air quality apps (e.g., AQI meters, weather apps) only report passive "doom numbers" without actionable, contextual instructions on how to survive severe days.
3. **Misinformation & Cost Barriers:** Many families cannot afford commercial HEPA units ($200–$600) and lack guidance on low-cost, DIY mitigation (e.g., Corsi-Rosenthal boxes, wet-towel door seals, natural ventilation timings).
4. **Lack of Impact Feedback:** People feel hopeless and assume individual or community choices make zero difference, disincentivizing personal emissions cuts and collective smog mitigation.

### How are users solving this today?
- Static weather/AQI dashboard monitors that display warnings like "Avoid Outdoor Activity" with no actionable follow-through.
- Haphazard WhatsApp and social media forwarding of untested air purification home remedies.
- Expensive proprietary air purifiers that run continuously with closed windows until CO₂ reaches toxic, drowsy levels.
- Complete absence of localized community advisory generators for schools and apartment complexes.

---

## 3. Goals
### Primary Goal
Empower vulnerable families and community leaders to proactively slash their inhaled PM2.5 exposure and neighborhood emissions through localized AI-generated action plans and real-time choice impact simulations.

### Secondary Goals
- Provide zero-cost and DIY clean air hacks that achieve >70% of commercial HEPA purifier efficacy.
- Clearly quantify the direct impact of every lifestyle choice (PM2.5 inhaled reduction in µg/m³ and %, plus weekly CO₂ prevented in kg).
- Pinpoint the exact daily atmospheric ventilation windows (temperature inversion breakdown periods) to safely air out homes without smog ingress.
- Generate shareable, print-ready community/school smog advisory bulletins in 1 click.
- Guarantee 100% offline resilience: if Gemini API is unreachable or rate-limited, immediately serve an expert-calibrated deterministic offline plan without crashing.

---

## 4. Target Users

### User Type 1: Urban Parent / Caregiver
- **Persona:** Priya & Vikram (Delhi / Lucknow)
- **Profile:** Parents of a 6-year-old child with mild asthma and living with a 72-year-old grandparent.
- **Needs:**
  - Clear hourly guidance on school commute safety, classroom window closures, and outdoor play restrictions.
  - Budget-friendly, reliable home purification techniques without buying 4 expensive HEPA purifiers.
  - Concrete numbers proving that switching routines actually protects their child's lungs.
- **Pain Points:** Overwhelmed by anxiety during winter smog spikes; confused about whether to keep windows shut all day or open them during brief afternoon sun.

### User Type 2: Community & School Organizer
- **Persona:** Marcus & Ananya (Resident Welfare Association / School Administrator)
- **Profile:** Manages a 400-unit apartment society or elementary school campus during hazardous pollution waves.
- **Needs:**
  - Rapid generation of clear, authoritative, 1-page smog advisory notices for bulletin boards and WhatsApp groups.
  - Sustainable neighborhood emissions reduction measures (carpooling, staggered heating times, avoiding leaf burning).
  - Clear explanations of "Why This Works" based on environmental science.
- **Pain Points:** Lack of standardized communications; resident friction over diesel generator bans and outdoor event cancellations.

---

## 5. User Stories
- **US-1 (Onboarding):** As a user in a smog-affected city, I want to quickly set my location, current AQI severity (or select a rapid preset like Delhi/NCR AQI 420), and household profile in 3 simple steps so that I receive recommendations tailored to my family's exact vulnerabilities.
- **US-2 (Action Engine):** As a caregiver, I want to receive categorized, actionable recommendations (Low-Emission Daily Routines, Indoor Air Quality Hacks, Sustainable Alternatives) so that I know what to do at home, on the road, and in my community.
- **US-3 (Choice Simulator):** As a user, I want to toggle individual recommended actions on or off and instantly see the simulated reduction in PM2.5 inhalation (µg/m³ and %) and weekly CO₂ saved (kg), alongside a scientific explanation of why it works.
- **US-4 (Peak-Smog Timeline):** As a parent, I want to view an hourly timeline indicating when outdoor smog peaks and the exact safe window for home ventilation so I do not trap toxic pollutants inside.
- **US-5 (Community Advisory):** As a community organizer, I want to export and print a clear Smog Advisory Card or export the plan as structured JSON so I can distribute notices across my neighborhood and school.

---

## 6. Core Features

### Feature 1: 3-Step Location & Lifestyle Onboarding Wizard
- **Purpose:** Collect essential environmental and lifestyle context to generate high-fidelity, customized air quality recommendations.
- **Step 1: Environmental Severity & Location:**
  - City/Region name input (max 50 chars).
  - Current outdoor AQI slider/input (range 0 to 500+).
  - Quick Winter Smog Preset Buttons:
    - *Delhi/NCR Winter Smog:* Severe+ AQI 420 (PM2.5 ~380 µg/m³).
    - *Industrial Basin Smog:* Very Poor AQI 310 (PM2.5 ~260 µg/m³).
    - *Urban Haze:* Poor AQI 180 (PM2.5 ~110 µg/m³).
    - *Moderate Winter Dust:* Moderate AQI 95 (PM2.5 ~45 µg/m³).
- **Step 2: Household Vulnerability & Living Space:**
  - Household members: Children (<12), Seniors (65+), Asthmatic/Respiratory sensitive individuals, Pregnant women, Pets.
  - Home type: Compact apartment, Standalone house, High-rise flat (floor level impacts particle settling).
- **Step 3: Commute & Home Infrastructure:**
  - Primary commute: Walking/Cycling, Open Two-Wheeler / Auto, Bus/Metro, Air-conditioned Car.
  - Existing clean air gear: Commercial HEPA Purifier, Box Fan / DIY filter, N95/FFP2 masks, None.
  - Cooking/Heating fuel: LPG, Piped Natural Gas, Electric Induction, Biomass/Chulha, Kerosene.
- **Acceptance Criteria:**
  - User can complete wizard in <45 seconds.
  - Presets instantly populate realistic AQI and environmental metrics.
  - Profile is saved immutably into `localStorage` (`aeroguard_state_v1`).
- **Edge Cases:**
  - User inputs an extreme AQI (>999): Clamped cleanly to 999 with extreme biohazard advisory flag.
  - User clears storage or navigates back: Wizard preserves draft state without crashing.

### Feature 2: Categorized GenAI Smog Action Engine
- **Purpose:** Generate targeted, prioritized mitigation strategies via Google Gemini 2.5 Flash API with guaranteed deterministic fallback.
- **Categories:**
  1. **Low-Emission Daily Routines:** Staggered travel, indoor exercise substitutes, damp-mopping instead of sweeping, active door threshold draught sealing.
  2. **Indoor Air Quality Hacks:** DIY Corsi-Rosenthal box assembly ($20 vs $300 commercial purifier), wet-curtain particle trapping, activated charcoal odour/VOC absorption, natural HEPA filter placement.
  3. **Sustainable Alternatives:** Carpool/EV routing, electric induction cooking transitions, community leaf composting instead of open combustion, non-fossil space heating.
- **Acceptance Criteria:**
  - Returns at least 2 high-priority actions per category.
  - Each action includes: title, step-by-step instructions, cost estimate ($/₹ level: Free, Low, Moderate), difficulty (Easy, Medium), and scientific rationale.
  - Fallback triggers within 5 seconds if Gemini API fails, returns malformed JSON, or user is offline.
- **Edge Cases:**
  - Gemini API key missing: App displays friendly banner and renders the deterministic offline plan without interruption.
  - Incomplete or malformed JSON from LLM: Runtime schema validation intercepts payload and recovers with `fallbackSmogPlan.ts`.

### Feature 3: Direct Choice Impact Simulator
- **Purpose:** Dynamically compute and display the direct personal health and ecological benefits of adopting each action item.
- **Outputs Calculated Live:**
  - Daily Inhaled PM2.5 Reduction: in micro-grams per cubic meter (µg/m³) and percentage reduction (%).
  - Weekly Greenhouse Gas Prevented: kg of CO₂ equivalent saved.
  - Scientific "Why This Works" expandable card (explaining particle filtration mechanics, respiratory deposition, and emissions combustion offsets).
- **Mathematical Baseline Model:**
  - Adult resting/light-activity breathing volume: ~12–15 m³ air/day.
  - Outdoor vs indoor penetration coefficient ($P = 0.5$ to $0.7$ for unsealed homes).
  - Toggling an N95 commute removes 95% of outdoor commute inhalation.
  - Running a DIY Corsi-Rosenthal unit reduces indoor room concentration by 65–85%.
  - Toggling public transit over private car saves ~2.4 kg CO₂/commute.
- **Acceptance Criteria:**
  - Toggling any action item updates metrics in <16ms (60fps reactive UI).
  - Interactive summary pill reflects: "Total PM2.5 Inhalation Reduced by X µg/m³ (Y%)".
  - Metrics never display negative or NaN values under any toggle combination.
- **Edge Cases:**
  - All actions deselected: Displays baseline exposure level with a prompt to enable high-impact actions.

### Feature 4: Peak-Smog Daily Ventilation & Lockdown Timeline
- **Purpose:** Inform users when outdoor atmospheric conditions are safe for brief home ventilation vs when absolute hermetic lockdown is mandatory.
- **Timeline Breakdown (24-Hour Horizon):**
  - **Early Morning (05:00 - 09:00):** *Severe Thermal Inversion.* Lockdown windows; zero outdoor exercise; maximum indoor filtration.
  - **Midday / Early Afternoon (12:30 - 15:30):** *Solar Boundary Layer Expansion.* Relative minimum daily PM2.5. Safe 15-minute cross-ventilation window if indoor CO₂ > 1200 ppm.
  - **Late Evening (18:00 - 22:00):** *Evening Commute & Surface Cooling Spike.* Hermetic seal; run purifiers on boost mode.
  - **Night (22:00 - 05:00):** *Stable Boundary Trapping.* Bedroom closed-door purification.
- **Acceptance Criteria:**
  - Visual time badges colored by hazard tier (Hazardous, Unhealthy, Moderate Window).
  - Current hour highlighted automatically based on user's local clock.

### Feature 5: Copyable/Printable Community & School Smog Advisory Card + JSON Export
- **Purpose:** Allow rapid dissemination of civic-grade smog protocols for schools, housing societies, and social platforms.
- **Capabilities:**
  - One-click copy formatted advisory text for WhatsApp / Slack / Email blasts.
  - Clean CSS Print mode (`@media print`) rendering a monochrome-friendly 1-page physical flyer with QR code link, urgent health protocols, and school recess recommendations.
  - Downloadable structured `.json` export of the household air quality plan.
- **Acceptance Criteria:**
  - Clipboard copy displays an immediate accessible confirmation toast.
  - Print preview formats cleanly on A4 / US Letter paper without overflowing content.
  - JSON download produces valid `aeroguard-plan-[city]-[timestamp].json`.

---

## 7. Non-Goals (Out of Scope for MVP)
- **No User Account Creation or Backend Auth:** No login, OAuth, passwords, or cloud database storage. Zero PII collected.
- **No Paid IoT Hardware Cloud Sync:** No direct Bluetooth/Tuya/Dyson cloud sensor syncing (users input their current AQI or choose quick presets).
- **No Live Sensor Hardware Purchase Gateway:** No e-commerce cart or affiliate ad sales.
- **No Native Mobile App Store Wrappers:** Pure responsive web SPA.

---

## 8. MVP Scope Matrix
| Feature | Must Have (MVP) | Nice to Have (Post-MVP) | Future |
|---|---|---|---|
| 3-Step Onboarding Wizard | Yes | Yes (Save multiple profiles) | Multi-home selector |
| Winter Smog Presets (Delhi, etc.) | Yes | Extended city list (50+ cities) | Live GPS geolocation AQI |
| GenAI Action Engine (3 Categories) | Yes | Voice audio summary readout | Multi-lingual translation |
| Choice Impact Simulator (PM2.5 & CO₂) | Yes | Monthly financial cost saving | Cumulative health score |
| Hourly Peak-Smog Timeline | Yes | Wind speed / humidity integration | Weather radar map overlay |
| Printable/Copyable Community Card | Yes | Branded school logo uploader | PDF generation library |
| JSON Plan Export | Yes | CSV / Spreadsheet export | Health clinic EHR sync |
| Deterministic Offline Mode | Yes | Offline PWA service worker | Native push notifications |

---

## 9. Success Metrics
- **PromptWars Evaluation Score:** 98+ out of 100 across all 6 Challenge criteria (Code Quality, Security, Efficiency, Testing, Accessibility, Problem Alignment).
- **Repository & Bundle Size:** Entire repository <10MB (clean, no bloat); production JS+CSS bundle <150KB gzipped.
- **Test Suite Verification:** 50+ passing automated unit/integration tests with 100% pass rate.
- **Time to First Recommendation:** <2.5 seconds with live Gemini 2.5 Flash; instantaneous (<50ms) with offline fallback.
- **Accessibility:** 100% WCAG 2.1 AA compliance (zero automated axe/lighthouse accessibility violations).

---

## 10. Constraints
- **Technical:** Client-only architecture running in modern browsers (Chrome, Edge, Safari, Firefox). Must execute cleanly under Vite with React 19 and Tailwind CSS v4.
- **Security:** Zero private API key leakage; strictly sanitized inputs to prevent OWASP LLM01 prompt injection; no PII stored in `localStorage`.
- **API Limits:** Must gracefully handle Gemini API free tier rate limits (15 RPM / 1M TPM) via client-side caching and fallback.
- **Code Limits:** Strict maximum of 180 lines of code per source file to ensure high maintainability and prevent AI hallucination sprawl.

---

## 11. Assumptions
- Users or community organizers have basic awareness of local air conditions or can select one of the high-visibility winter smog presets (e.g., Delhi AQI 420).
- Users have access to modern evergreen web browsers with JavaScript and `localStorage` enabled.
- The standard WHO and EPA air quality particulate models are applicable for baseline respiratory inhalation estimations.

---

## 12. Open Questions & Future Considerations
- *Q: Should we support multilingual prompts in Hindi/Urdu/Mandarin for local communities?*  
  *Decision for MVP:* Default to clear, simple English in the UI while allowing Gemini prompt to accept localized city names. Post-MVP will introduce one-click Hindi translation.
- *Q: How often should the AI plan be re-generated?*  
  *Decision for MVP:* Cache plan against the `HouseholdProfile` hash in `localStorage`. Only trigger API re-generation when user updates their profile or clicks "Regenerate Plan".

---

## 13. Definition of Done
The product is complete when:
- [x] All 5 core features are fully specified with zero ambiguous placeholders.
- [x] All edge cases (missing API key, rate limits, malformed JSON, extreme inputs) have explicit handling strategies.
- [x] Architecture, security, design system, and testing specifications are mutually aligned.
- [x] 100% of acceptance criteria can be validated via automated tests and manual verification gates.

