# AeroGuard AI 🛡️💨
### Intelligent Urban Smog Defense & Community Action Assistant
**Hack2Skill PromptWars Virtual Challenge 06: Urban Air Quality Assistant**

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-100%25_Passing-brightgreen.svg)](https://vitest.dev/)
[![oxlint](https://img.shields.io/badge/Linter-oxlint_Clean-orange.svg)](https://oxc.rs/)

---

## 1. Problem Overview
Dense urban corridors across the Indo-Gangetic basin and major metropolitan centers face catastrophic winter smog episodes where Air Quality Index (AQI) values routinely surpass 300 to 500+ (PM2.5 concentrations exceeding 250–500 µg/m³).

Standard weather apps report passive "doom numbers" without actionable, budget-conscious guidance. Families lack accessible means to afford commercial air purifiers, while schools and neighborhood associations struggle to issue standardized smog advisories.

**AeroGuard AI** is a GenAI-powered urban air quality assistant that empowers families and community organizers to:
1. Navigate severe winter smog with hyper-localized daily routines.
2. Build DIY clean air hacks (like Corsi-Rosenthal boxes) that deliver commercial-grade filtration at a fraction of the cost.
3. Simulate and quantify the direct impact of lifestyle choices (daily PM2.5 inhalation reduction in µg/day and weekly CO₂ saved in kg).
4. Time safe indoor ventilation during midday thermal inversion lift windows.
5. Generate and distribute 1-click civic-grade community smog advisories.

---

## 2. Key Features

- **3-Step Location & Lifestyle Onboarding Wizard:**
  - Rapid 1-click winter smog presets (*Delhi NCR AQI 420*, *Mumbai Coastal Haze AQI 165*, *Indo-Gangetic Inversion AQI 310*).
  - Household vulnerability profiling (Children, Seniors, Asthma/COPD, Pregnancy).
  - Dwelling architecture, daily commute mode, cooking fuel, and existing filtration gear analysis.

- **Resilient Multi-Model Gemini Failover Service:**
  - Primary model: `gemini-3.5-flash-lite` for high free-tier rate limits and minimal latency.
  - Automatic model failover chain: `gemini-3.5-flash-lite` ➔ `gemini-3.5-flash` ➔ `gemini-3.8-flash`.
  - Zero-failure offline deterministic fallback: Expert-calibrated rules engine (`fallbackSmogPlan.ts`) guarantees continuous operation even without an internet connection or API quota.

- **Direct Choice Impact Simulator:**
  - Real-time reactive calculation (<16ms) of daily PM2.5 inhalation reduction (µg/day and % reduction).
  - Weekly household carbon emission prevention (kg CO₂e/week).
  - Dynamic 0–100 Household Protection Score with live accessible feedback (`aria-live="polite"`).

- **Categorized Smog Defense Actions:**
  - 3 Pillars: *Low-Emission Routines*, *Indoor Air Quality Hacks*, and *Sustainable Alternatives*.
  - Science-backed **"Why This Works"** educational rationales for every action.
  - Cost tier badges (*Free DIY*, *Low Cost*, *Moderate*).

- **Hourly Inversion & Safe Ventilation Timeline:**
  - Visual 24-hour meteorological inversion schedule indicating when surface smoke is trapped versus safe midday cross-ventilation windows.

- **Civic & School Smog Advisory Card:**
  - 1-Click **Copy Formatted Notice** for WhatsApp society groups and school councils.
  - **Download JSON Blueprint** with sanitized filenames.
  - Print-ready clean flyer stylesheet (`window.print()`).

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 | Modern functional UI with concurrent rendering |
| **Language** | TypeScript 5.7+ | Strict mode (`strict: true`, `noUncheckedIndexedAccess: true`, zero `any`) |
| **Build Tool** | Vite 6 | Instant HMR and optimized production bundling (<100KB gzip) |
| **Styling** | Tailwind CSS v4 | Utility-first zero-runtime CSS with custom environmental health design tokens |
| **GenAI SDK** | `@google/generative-ai` | Google Gemini API integration with structured JSON outputs |
| **Testing** | Vitest 3 + RTL | 55+ unit & integration tests with 100% pass rate |
| **Linter** | oxlint | Ultra-fast Rust-based static code verification |
| **Icons** | Lucide React | Accessible SVG iconography |

---

## 4. Architecture & Security Principles

- **Pure Client SPA:** No backend server or cloud database required; zero user PII collected or stored.
- **Service-Hook Isolation:** UI components never invoke the Gemini API or access storage directly; all business math lives in pure utility functions (`src/utils/`).
- **File Length Hard Cap:** Every single source and test file is strictly under 180 lines of code.
- **OWASP LLM01 Sanitization:** User inputs are defensively sanitized to strip ASCII control codes, zero-width spaces, and injection tokens before prompt interpolation.
- **Defensive Storage:** Persistent storage (`localStorage['aeroguard_state_v1']`) is wrapped with defensive error handling to prevent quota or private browsing exceptions.

---

## 5. Local Development Setup

### Prerequisites
- Node.js 18+ (tested on Node v20/v22/v25)
- npm 9+

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Parth1020738/AeroGuard-AI.git
   cd AeroGuard-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local` and add your Google Gemini API key:
   ```bash
   cp .env.example .env.local
   ```
   *Note: If no API key is provided, AeroGuard AI will run in offline mode using the deterministic smog defense engine.*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 6. Verification Pipeline

Run all verification gates sequentially:

```bash
# 1. Type check
npm run typecheck

# 2. Lint verification
npm run lint

# 3. Unit and integration test suite
npm run test

# 4. Production build bundle verification
npm run build
```

---

## 7. License
MIT License. Built for the Hack2Skill PromptWars Virtual Challenge 06.
