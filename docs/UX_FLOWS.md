# User Experience & Interaction Flows — AeroGuard AI

## 1. Flow Overview & Information Architecture
AeroGuard AI is structured around 3 primary user journeys engineered for high cognitive clarity during stressful high-smog emergencies:
- **Flow 1:** First-Time Household Onboarding & Rapid Preset Configuration
- **Flow 2:** Interactive Choice Impact Simulation & Scientific Inspection
- **Flow 3:** Peak-Smog Schedule Navigation & Community Advisory Dissemination

---

## 2. Flow 1: First-Time Household Onboarding
### Context & Objective
A parent or household manager opens AeroGuard AI while facing a sudden morning smog spike. They need immediate, personalized clean air recommendations within 45 seconds without filling out extensive paperwork.

```
+-----------------------------------------------------------------------------------+
| FLOW 1: ONBOARDING & PRESET WIZARD                                                |
|                                                                                   |
|  [ Step 1: Location & AQI ]                                                       |
|  * Enter City (e.g. Delhi NCR) or Click Preset:                                   |
|    [ Delhi AQI 420 ] [ Industrial AQI 310 ] [ Urban Haze 180 ]                     |
|  * Real-time AQI Hazard Badge dynamically updates                                 |
|            |                                                                      |
|            v Click "Next: Household Vulnerability"                                |
|  [ Step 2: Vulnerability Profile ]                                                |
|  * Checkboxes: [x] Children (<12)  [x] Seniors (65+)                              |
|                [x] Asthma/Respiratory  [ ] Pregnant                               |
|  * Home Type: [ Apartment (Floors 1-4) ]                                          |
|            |                                                                      |
|            v Click "Next: Commute & Home Gear"                                    |
|  [ Step 3: Commute & Clean Air Gear ]                                              |
|  * Commute: [ Open Two-Wheeler ]                                                  |
|  * Existing Gear: [ None ] -> Trigger DIY Filter recommendations                 |
|  * Cooking: [ LPG Cylinder ]                                                      |
|            |                                                                      |
|            v Click "Generate Clean-Air Defense Plan"                              |
|  [ AI Engine Dispatch ]                                                           |
|  * Display Shimmering Skeleton Loader with accessible status                       |
|  * Fetch Gemini 2.5 Flash OR Instant Fallback on Rate Limit / Timeout             |
|            |                                                                      |
|            v Transition                                                           |
|  [ Dashboard View Loaded & State Persisted in localStorage ]                      |
+-----------------------------------------------------------------------------------+
```

### State Behaviors
- **Loading State:** Modal disables the "Next" button and displays a pulsating skeleton container with label *"Synthesizing personalized smog defense plan..."*.
- **Empty State:** If the user opens the app without a saved profile, the 3-step wizard modal automatically appears over a subdued backdrop.
- **Error State:** If the user enters a non-numeric AQI or an empty city name, inline red error text appears immediately under the input (`"Please provide a valid city name"`).
- **Success State:** The wizard closes with a smooth fade-in transition into the interactive dashboard with all categorized recommendations pre-loaded.

---

## 3. Flow 2: Interactive Choice Impact Simulation
### Context & Objective
The user reviews their action plan and wants to know which daily changes yield the highest health protection and carbon reductions.

```
+-----------------------------------------------------------------------------------+
| FLOW 2: CHOICE IMPACT SIMULATION                                                  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | STICKY IMPACT SUMMARY BAR (Top/Floating)                                   |  |
|  | [ Inhaled PM2.5: -184 µg/m³ (-74%) ]  [ CO2 Saved: 12.8 kg/wk ]              |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  [ Category Tabs: (1) Routines  |  (2) Indoor Hacks  |  (3) Alternatives ]        |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | ACTION CARD: DIY Corsi-Rosenthal Box Purifier                               |  |
|  | - Status: [ ACTIVE (TOGGLED ON) ]                                           |  |
|  | - Cost: Low ($25) | Difficulty: Easy (20 mins assembly)                     |  |
|  | - Impact: Reduces indoor particulate load by 72 µg/m³                       |  |
|  |                                                                             |  |
|  | > Click "Why This Works" (Accordion Expand)                                 |  |
|  |   [ Expanded Rationale ]: MERV-13 filters capture 85% of sub-micron PM2.5   |  |
|  |   without generating ozone. Moving 300 CFM provides 4 air changes/hr.       |  |
|  +-----------------------------------------------------------------------------+  |
|                                      |                                            |
|                                      v User toggles action switch OFF             |
|  +-----------------------------------------------------------------------------+  |
|  | REACTIVE RECALCULATION (<16ms)                                              |  |
|  | * PM2.5 inhalation reduction drops to: -112 µg/m³ (-46%)                     |  |
|  | * Summary counter updates with aria-live="polite" screen reader speech      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### State Behaviors
- **Loading State:** Metrics card displays a subtle shimmering overlay if a new plan generation is underway.
- **Empty State:** If all actions are deselected, the summary displays: *"Baseline exposure active. Enable recommended routines to reduce your inhaled toxins."*
- **Success State:** Dynamic color change on the summary pill (e.g., transition from amber to reassuring deep teal as the reduction exceeds 50%).

---

## 4. Flow 3: Peak-Smog Schedule Navigation & Community Advisory Dissemination
### Context & Objective
A school teacher, parent, or apartment representative needs to schedule outdoor activities, identify when to open windows, and issue a warning flyer to neighbors.

```
+-----------------------------------------------------------------------------------+
| FLOW 3: PEAK-SMOG TIMELINE & ADVISORY SHARING                                     |
|                                                                                   |
|  [ Peak-Smog Timeline Section ]                                                   |
|  * 05:00 - 09:00: [ HAZARDOUS ] Thermal inversion spike. Hermetic seal.           |
|  * 12:30 - 15:30: [ SAFE AIRING ] Solar expansion. 15-min cross-ventilation.     |
|  * 18:00 - 22:00: [ SEVERE ] Evening commute & smoke drop. Boost purifiers.       |
|  * Current hour highlighted automatically with pulsing indicator                  |
|                                                                                   |
|            |                                                                      |
|            v Click "Share Community Advisory"                                     |
|  +-----------------------------------------------------------------------------+  |
|  | COMMUNITY ADVISORY MODAL                                                    |  |
|  | - Formatted text ready for WhatsApp / School Notice Boards                   |  |
|  |                                                                             |  |
|  | [ Copy Formatted Text ]  --> Displays "Copied to clipboard!" toast (3s)      |  |
|  | [ Print Clean Flyer ]    --> Opens browser print dialog (A4, print-styled)   |  |
|  | [ Download Plan JSON ]   --> Downloads 'aeroguard-plan-delhi-ncr.json'      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### State Behaviors
- **Loading State:** Buttons show subtle spinners while copying to clipboard or building print documents.
- **Error State:** If clipboard permissions are blocked by the browser, fallback to selecting the text inside a read-only textarea with the message: *"Press Ctrl+C to copy"*.
- **Success State:** Green confirmation toast: *"Advisory copied to clipboard — ready to paste into your society or school group!"*

---

## 5. Global Keyboard Navigation Map
| Key Command | Action |
|---|---|
| `Tab` / `Shift+Tab` | Navigate sequentially through all interactive controls and wizard steps |
| `Space` / `Enter` | Toggle action checkboxes, trigger buttons, and open/close modals |
| `Escape` | Close active modal dialog (Wizard or Community Advisory) and return focus |
| `Alt + 1` | Jump to Low-Emission Routines tab |
| `Alt + 2` | Jump to Indoor Hacks tab |
| `Alt + 3` | Jump to Sustainable Alternatives tab |

