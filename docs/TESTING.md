# Testing Strategy & Quality Assurance — AeroGuard AI

## 1. Testing Goals & Coverage Target
- **Primary Objective:** Ensure rock-solid reliability, mathematical precision, security resilience, and crash-proof offline fallback recovery across the entire application.
- **Coverage Target:**
  - Minimum of **50+ automated unit and integration tests**.
  - **100% test pass rate** on every commit and build check.
  - 100% coverage on core mathematical calculation utilities (`impactMath.ts`).
  - 100% coverage on input sanitization and schema validators (`sanitizers.ts`, `validators.ts`).

---

## 2. Testing Framework & Tools
- **Test Runner:** `Vitest` (v3.x) — Ultra-fast native ESM test runner with instant HMR and full Jest-compatible API.
- **Component Testing:** `@testing-library/react` (v16.x) + `@testing-library/jest-dom` — Verifying actual user behavior, accessibility attributes, and DOM rendering.
- **Environment:** `jsdom` — Emulated browser DOM with mock Web Storage and clipboard APIs.
- **Execution Mode:** Isolated unit test workers with zero cross-test state leakage.

---

## 3. Test File Architecture
Test files are organized in a dedicated `tests/` tree mirroring `src/`:
```
tests/
├── utils/
│   ├── impactMath.test.ts          # 15 tests: PM2.5 inhalation, percentage reduction, CO2 offsets
│   ├── sanitizers.test.ts          # 10 tests: Control chars, injection tokens, filename safety
│   ├── validators.test.ts          # 10 tests: Runtime JSON schema type guard verification
│   └── dateUtils.test.ts           # 5 tests: Ventilation window timing & hour matching
├── services/
│   ├── fallbackSmogPlan.test.ts    # 8 tests: Deterministic plan generation & preset mapping
│   └── exportService.test.ts       # 4 tests: Advisory text formatting & JSON serialization
└── components/
    ├── OnboardingWizard.test.tsx   # 6 tests: Step progression, presets, validation
    ├── ImpactSimulator.test.tsx    # 4 tests: Toggle action & reactive metrics updates
    └── Dashboard.test.tsx          # 4 tests: Layout, fallback banner, error boundary
```

---

## 4. Critical User Flows & Test Cases

### Suite 1: Mathematical Calculation Precision (`impactMath.test.ts`)
- `test_aqi_boundary_zero`: AQI 0 yields 0 µg/m³ baseline inhaled PM2.5.
- `test_aqi_boundary_extreme`: AQI 999 clamps safely without mathematical overflow or NaN.
- `test_pm25_inhalation_reduction_hepa`: Enabling a commercial or DIY HEPA filter removes 65–85% of indoor inhaled particles.
- `test_n95_commute_reduction`: Walking or riding with an N95 mask slashes commute exposure by 95%.
- `test_co2_transit_offset`: Switching from private fossil car to metro/bus computes accurate 2.4 kg CO₂ saved per 10km trip.
- `test_all_actions_disabled`: Metrics report zero reduction, never negative values.
- `test_all_actions_enabled`: Percentage reduction caps logically at 100%, never exceeds physiological boundaries.

### Suite 2: Security & Prompt Injection Sanitization (`sanitizers.test.ts`)
- `test_strip_control_characters`: Strips non-printable ASCII characters (e.g., `\x00`, `\x1B`, `\x7F`).
- `test_strip_prompt_injection_tokens`: Neutralizes strings containing `system:`, `assistant:`, ```` ``` ````, or `ignore previous instructions`.
- `test_length_truncation`: Truncates long city strings over 50 characters cleanly without splitting surrogate pairs.
- `test_filename_sanitization`: Sanitizes city names with spaces and special characters (`"New Delhi / NCR!"` -> `"aeroguard-plan-new-delhi-ncr-[timestamp].json"`).

### Suite 3: Runtime Schema Type Guards (`validators.test.ts`)
- `test_valid_plan_accepts_good_payload`: Returns `true` for complete `AirQualityPlan` object.
- `test_rejects_missing_actions_array`: Returns `false` if `actions` is omitted or null.
- `test_rejects_malformed_action_item`: Returns `false` if an action item lacks `scientificRationale` or numeric impact estimates.
- `test_rejects_invalid_timeline`: Returns `false` if ventilation windows are missing required risk levels.

### Suite 4: Deterministic Fallback Resilience (`fallbackSmogPlan.test.ts`)
- `test_generates_complete_plan_offline`: Generates full valid `AirQualityPlan` with zero network access.
- `test_adapts_to_vulnerable_household`: Prioritizes pediatric and asthma-specific routines when `hasChildren` or `hasRespiratorySensitivity` is true.
- `test_preset_alignment`: Delhi AQI 420 preset triggers emergency thermal inversion lockdown timeline.

### Suite 5: Component & State Integration (`OnboardingWizard.test.tsx`, `ImpactSimulator.test.tsx`)
- `test_wizard_preset_button_populates_aqi`: Clicking "Delhi/NCR Severe Smog" sets AQI to 420 and city to "Delhi NCR".
- `test_wizard_step_navigation`: Forward and backward buttons step cleanly through the 3 phases.
- `test_action_toggle_updates_simulator_badge`: Clicking an action card's toggle switch re-renders the live PM2.5 reduction counter instantly.
- `test_accessible_announcements`: Live region updates carry appropriate `aria-live="polite"` attributes.

---

## 5. Verification Commands
The test suite is fully integrated into the project's standard npm run scripts:

```bash
# 1. Run full test suite in single-run mode
npm run test

# 2. Run tests in interactive watch mode for TDD development
npm run test:watch

# 3. Run test coverage inspection report
npm run test:coverage

# 4. Run type check validation gate
npx tsc --noEmit

# 5. Run static lint verification
npm run lint

# 6. Verify production build bundle
npm run build
```

---

## 6. Definition of Done for Testing
A feature or pull request is verified and ready to merge only when:
- [x] All 50+ unit and integration tests pass with 0 failures (`npm run test`).
- [x] Zero type errors reported by TypeScript strict compiler (`npx tsc --noEmit`).
- [x] Zero lint warnings or errors reported by `oxlint` (`npm run lint`).
- [x] Edge cases (network offline, rate limit, extreme input values) pass automated tests.
- [x] Production build completes with bundle size under 150KB gzipped (`npm run build`).

