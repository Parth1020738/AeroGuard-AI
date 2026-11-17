# System Architecture — AeroGuard AI

## 1. System Overview
AeroGuard AI is architected as a lightweight, zero-latency, high-reliability Client-Side Single Page Application (SPA). It provides hyper-localized smog defense plans, indoor air quality hacks, peak-smog ventilation schedules, and real-time choice impact simulations for urban households and community leaders.

The application enforces a **Strict Service-Hook Separation Pattern**: UI components never interact directly with the Google Gemini API or browser storage; instead, they consume domain-driven custom React hooks that coordinate pure utility math and isolated service clients. If the Gemini API is unreachable, rate-limited, or returns malformed data, the architecture seamlessly falls back to a calibrated deterministic offline plan engine (`fallbackSmogPlan.ts`), guaranteeing 100% operational uptime.

---

## 2. Architecture Pattern
- **Pattern:** Modular Client-Side SPA with Layered Unidirectional Data Flow.
- **Why this approach?**
  1. *Immediate Responsiveness:* Urban residents facing sudden morning smog spikes need instant advice without waiting for heavy multi-tier server handshakes.
  2. *Zero Hosting Overhead & Privacy by Design:* Running entirely on the client ensures that zero sensitive family vulnerability data ever touches an external application database.
  3. *Zero-Failure Offline Resilience:* Extreme weather events frequently disrupt local ISP networks. AeroGuard AI caches all rules and state locally, continuing to calculate choice impacts and render ventilation windows even without active internet connectivity.

---

## 3. Technology Stack
| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime / UI** | React | 19.x | Modern functional UI with concurrent rendering and compiler support |
| **Language** | TypeScript | 5.x (`strict: true`) | Complete compile-time type safety across domain and API contracts |
| **Build & Dev Tool** | Vite | 6.x | Instant HMR and optimized production bundling (<150KB gzip) |
| **Styling** | Tailwind CSS | v4.x | Utility-first, zero-runtime CSS engine with custom design tokens |
| **GenAI Engine** | Google Gemini API | `gemini-2.5-flash` | Ultra-fast structured JSON generation via `@google/generative-ai` |
| **Local Persistence** | Web Storage API | `localStorage` | Client-side persistence under key `aeroguard_state_v1` |
| **Testing** | Vitest + RTL | 3.x / 16.x | Fast ESM unit and integration testing suite |
| **Linting** | oxlint | Latest | High-speed Rust-based linting for clean, reliable code standards |
| **Icons** | Lucide React | Latest | Accessible, lightweight SVG iconography |
| **Deployment** | Vercel / Static CDN | Edge | Global edge static asset distribution |

---

## 4. System Components

### Frontend Components (`src/components/`)
- **Common UI Elements (`src/components/common/`):** Reusable design system primitives: `Button`, `Card`, `Badge`, `Modal`, `AlertBanner`, `SkeletonLoader`.
- **Onboarding Wizard (`src/components/wizard/`):** Multi-step form managing location input, winter smog presets, vulnerability profiling, and home setup.
- **Dashboard Modules (`src/components/dashboard/`):**
  - `SmogActionList`: Categorized cards for routines, indoor hacks, and sustainable alternatives with interactive toggles.
  - `ImpactSimulator`: Reactive calculation widget rendering live PM2.5 inhalation drops and CO₂ savings.
  - `VentilationTimeline`: Hourly 24-hour visual bar indicating thermal inversion hazards and safe airing windows.
  - `CommunityAdvisoryCard`: Print/copy formatted modal for school and neighborhood notice distribution.

### Application Hooks (`src/hooks/`)
- `useAirQualityPlan`: Orchestrates profile updates, Gemini API requests, fallback triggering, and plan caching.
- `useChoiceSimulator`: Computes real-time dynamic impact metrics when users toggle mitigation actions.
- `useLocalStorage`: Type-safe abstraction over `window.localStorage` with error handling and fallback memory state.

### Services Layer (`src/services/`)
- `geminiService.ts`: Direct client interface with `@google/generative-ai`. Handles prompt synthesis, temperature tuning, JSON schema constraints, and timeout policies.
- `fallbackSmogPlan.ts`: Pure deterministic domain engine providing expert-curated air quality plans when Gemini is offline or rate-limited.
- `exportService.ts`: Handles file-saver generation for JSON export and clipboard serialization for community advisories.

### Pure Utilities (`src/utils/`)
- `impactMath.ts`: Pure mathematical formulas for respiratory PM2.5 inhalation calculation and CO₂ emission factor offsets.
- `sanitizers.ts`: Input sanitation routines stripping ASCII control codes and dangerous tokens to prevent prompt injection.
- `validators.ts`: Runtime TypeScript type guards validating untrusted API responses against domain schemas.

---

## 5. ASCII Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                           REACT 19 UI LAYER                               |   |
|   |  +---------------------+  +--------------------+  +--------------------+  |   |
|   |  | 3-Step Wizard Modal |  | Categorized Cards  |  |  Choice Simulator  |  |   |
|   |  +----------+----------+  +---------+----------+  +---------+----------+  |   |
|   |             |                       |                       |             |   |
|   |  +----------v-----------------------v-----------------------v----------+  |   |
|   |  |        Peak-Smog Timeline   &   Printable Community Advisory       |  |   |
|   |  +----------------------------------+----------------------------------+  |   |
|   +-------------------------------------|-------------------------------------+   |
|                                         |                                         |
|                                         v                                         |
|   +---------------------------------------------------------------------------+   |
|   |                     CUSTOM HOOKS & STATE CONTROLLER                       |   |
|   |         useAirQualityPlan()           |        useChoiceSimulator()       |   |
|   +-------------------+-------------------|-------------------+---------------+   |
|                       |                   |                   |                   |
|                       v                   |                   v                   |
|   +------------------------------+        |         +---------------------+       |
|   |   SERVICES LAYER             |        |         | PURE UTILS          |       |
|   |   geminiService.ts           |        |         | impactMath.ts       |       |
|   |   fallbackSmogPlan.ts        |        |         | sanitizers.ts       |       |
|   |   exportService.ts           |        |         | validators.ts       |       |
|   +---------------+--------------+        |         +---------------------+       |
|                   |                       |                                       |
|         +---------+---------+             v                                       |
|         |                   |     +-------------------------------+               |
|         v                   v     | LOCAL PERSISTENCE             |               |
|   (Network Call)       (Offline)  | localStorage:                 |               |
|   Google Gemini API    Fallback   | 'aeroguard_state_v1'          |               |
|   (gemini-2.5-flash)   Engine     +-------------------------------+               |
+---------+-------------------------------------------------------------------------+
          |
          v (HTTPS POST / JSON)
+-----------------------------------+
|  Google Generative AI Endpoint    |
|  (Cloud LLM Structured Output)    |
+-----------------------------------+
```

---

## 6. 8-Step Data Flow
1. **User Input / Preset Selection:** User opens the app and either configures their household profile in the 3-Step Wizard or clicks a quick Winter Smog preset (e.g., *Delhi AQI 420*).
2. **Sanitization & State Persistence:** `sanitizers.ts` strips any control characters and trims inputs; the resulting `HouseholdProfile` is saved to `localStorage` under `aeroguard_state_v1`.
3. **Plan Request Trigger:** `useAirQualityPlan` detects a dirty profile or explicit regeneration request, transitioning the UI into a accessible skeleton loading state.
4. **Service Dispatch:** `geminiService.ts` builds a prompt enforcing `responseMimeType: "application/json"` with an exact TypeScript-compatible schema.
5. **API Evaluation or Fallback Recovery:**
   - *Happy Path:* Gemini 2.5 Flash responds within ~1.5s with structured JSON.
   - *Error Path:* If the API times out (>5000ms), errors with 429/500, or returns malformed JSON, `geminiService` intercepts the error and immediately invokes `fallbackSmogPlan.ts`.
6. **Runtime Schema Validation:** `validators.ts` runs runtime type guard `isValidAirQualityPlan(data)` to ensure that all required categories, items, and timeline windows exist.
7. **Simulation & Reactive Impact Calculation:** The validated plan and profile are loaded into `useChoiceSimulator`. The hook calculates baseline inhaled PM2.5 (µg/m³) and sets initial action selections.
8. **UI Render & Interaction:** The dashboard renders categorized action cards, hourly timeline bars, and live metric badges. As the user toggles individual actions, `impactMath.ts` recomputes inhaled PM2.5 drops and CO₂ savings in <16ms.

---

## 7. Exact Project Structure
```
aeroguard-ai/
├── docs/                               # 9 Comprehensive Blueprint Technical Documents
│   ├── PRD.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── CODE_STYLE.md
│   ├── TESTING.md
│   ├── UX_FLOWS.md
│   └── API.md
├── src/
│   ├── types/                          # Strict Domain & API TypeScript Interfaces
│   │   ├── airQuality.ts               # Core entities: HouseholdProfile, SmogAction, etc.
│   │   └── gemini.ts                   # Gemini API request/response schemas
│   ├── utils/                          # Pure Mathematical & Sanitization Utilities
│   │   ├── impactMath.ts               # PM2.5 inhalation & CO2 calculations
│   │   ├── sanitizers.ts               # Input sanitizers & prompt injection prevention
│   │   ├── validators.ts               # Runtime JSON schema type guards
│   │   └── dateUtils.ts                # Timeline window formatters & hour detectors
│   ├── services/                       # External API & Persistence Clients
│   │   ├── geminiService.ts            # Google Generative AI client wrapper
│   │   ├── fallbackSmogPlan.ts         # Calibrated deterministic offline generator
│   │   └── exportService.ts            # JSON file export & clipboard formatter
│   ├── hooks/                          # Reusable Application Hooks
│   │   ├── useAirQualityPlan.ts        # Plan generation, loading & fallback logic
│   │   ├── useChoiceSimulator.ts       # Live reactive impact recalculation
│   │   └── useLocalStorage.ts          # Type-safe persistent storage hook
│   ├── components/                     # Atomic, Accessible React Components
│   │   ├── common/                     # Reusable Design System Elements
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── AlertBanner.tsx
│   │   ├── wizard/                     # Onboarding Form Subcomponents
│   │   │   ├── OnboardingWizard.tsx    # Multi-step wizard coordinator
│   │   │   ├── StepLocationAQI.tsx     # Step 1: Location & Smog presets
│   │   │   ├── StepVulnerability.tsx   # Step 2: Children, seniors, sensitivities
│   │   │   └── StepInfrastructure.tsx  # Step 3: Commute, purifier, heating fuel
│   │   └── dashboard/                  # Core Dashboard Widgets
│   │       ├── Header.tsx              # Brand header, offline status, reset CTA
│   │       ├── ImpactSimulator.tsx     # Dynamic metrics display (PM2.5, CO2)
│   │       ├── SmogActionList.tsx      # Categorized routines & DIY hacks
│   │       ├── ActionCard.tsx          # Individual action item with toggle & rationale
│   │       ├── VentilationTimeline.tsx # 24h inversion & safe window timeline
│   │       └── CommunityAdvisory.tsx   # Printable/Copyable community notice
│   ├── App.tsx                         # Top-level view coordinator
│   ├── main.tsx                        # Application mount entry point
│   └── index.css                       # Tailwind v4 import & font definitions
├── tests/                              # Comprehensive Vitest Test Suites (50+ tests)
│   ├── utils/                          # Unit tests for math, sanitizers, validators
│   ├── services/                       # Unit tests for fallback engine & schema parser
│   └── components/                     # Integration tests for wizard & dashboard
├── AGENTS.md                           # Operational agent instructions (Vibe Blueprint)
├── package.json                        # Zero-dependency, clean npm manifest
├── tsconfig.json                       # Strict TypeScript configuration
└── vite.config.ts                      # Vite build configuration with Vitest setup
```

---

## 8. Dependency Rules & Architecture Guardrails
1. **No Direct API Calls from UI Components:** A React component must NEVER import `@google/generative-ai` or `geminiService.ts` directly. All API operations must be invoked through the `useAirQualityPlan` hook.
2. **Pure Functions in `src/utils/`:** Utilities must remain 100% side-effect-free pure functions. They must never access `localStorage`, `window`, or network sockets.
3. **File Length Hard Cap:** No single file may exceed **180 lines of code**. Large components must be broken down into dedicated modular subcomponents (e.g., `OnboardingWizard` is split across 3 step components).
4. **Unidirectional Import Rule:**
   - `components` can import `hooks`, `types`, and `utils`.
   - `hooks` can import `services`, `types`, and `utils`.
   - `services` can import `types` and `utils`.
   - `utils` can ONLY import other `utils` or `types`.
   - `types` can NEVER import from any executable code.

---

## 9. Key Technical Decisions
- **Decision 1: Direct Client Google Gemini SDK vs Custom Express Server:**
  - *Context:* The challenge requires a fast, lightweight, high-trust application without backend deployment friction.
  - *Alternative:* Running a Node/Express backend proxy.
  - *Reasoning:* A client-side SPA with `@google/generative-ai` completely eliminates backend hosting failures, simplifies Vercel/GitHub Pages deployment, and preserves user privacy. API keys are managed safely via environment variables.
- **Decision 2: Deterministic Calibrated Fallback vs Generic Static Text:**
  - *Context:* In high-smog emergencies or under API rate limits, the app must deliver expert-grade, non-generic advice.
  - *Reasoning:* `fallbackSmogPlan.ts` uses real meteorological and public health heuristics (temperature inversion schedules, Corsi-Rosenthal box specifications, N95 filtration factors) to construct a tailored plan based on the user's specific inputs even while 100% offline.
- **Decision 3: Synchronous Pure Math for Impact Simulation:**
  - *Context:* Toggling actions must feel instantaneous to the user.
  - *Reasoning:* By formulating PM2.5 inhalation and CO₂ savings as mathematical equations derived from EPA/WHO particulate exposure models, simulation updates take <1ms, enabling 60fps reactive slider and toggle feedback.

---

## 10. Performance Considerations
- **Bundle Size:** Zero large component libraries or heavy animation suites. Target production bundle is <150KB gzipped.
- **Memoization Strategy:** All impact calculation results are memoized via `useMemo` in `useChoiceSimulator`, preventing unnecessary re-renders when navigating the UI.
- **Instant First Contentful Paint (FCP):** All base styles are compiled into static CSS by Tailwind v4. The initial page renders in <300ms on 4G mobile connections.

---

## 11. Scalability Considerations
- **Stateless Client:** Zero server memory or concurrent socket limits. The app scales effortlessly from 1 to 10,000,000 concurrent users via CDN static hosting.
- **API Optimization:** Generated plans are cached against the hash of the household profile. Repeat visits do not consume additional Gemini API tokens unless the user deliberately updates their profile.

---

## 12. Failure Scenarios & Self-Healing
| Failure Event | Detection Mechanism | Immediate Self-Healing Behavior |
|---|---|---|
| **Gemini API Timeout (>5000ms)** | `AbortController` in `geminiService.ts` | Aborts fetch, logs warning, immediately delivers `fallbackSmogPlan`, displays informational chip "Offline Smog Defense Active". |
| **API Rate Limit Exceeded (HTTP 429)** | Response status catch block | Seamlessly swaps to `fallbackSmogPlan`; sets user-friendly alert banner with retry timer. |
| **Malformed LLM JSON Output** | `JSON.parse` failure or `isValidAirQualityPlan` type guard returning `false` | Discards invalid JSON, captures telemetry error safely, and loads the deterministic plan for the user's exact profile. |
| **Corrupted `localStorage`** | `JSON.parse` catch block in `useLocalStorage.ts` | Clears corrupted key, restores pristine default seed state, and prompts user to review settings without crashing. |
| **No Internet Connection** | `navigator.onLine === false` | Bypasses network call entirely; generates plan from local rules engine instantly. |

