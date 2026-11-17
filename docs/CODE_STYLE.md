# Code Style & Engineering Conventions — AeroGuard AI

## 1. General Principles
- **Readability Over Cleverness:** Write transparent, self-explanatory code that any engineer can review in seconds.
- **Strict Single Responsibility:** Every module, file, and React component must have exactly one reason to change.
- **Pure Functions for Business Math:** All algorithms calculating particulate reductions, emissions factors, and AQI bands must be pure functions isolated in `src/utils/`.
- **Zero Unnecessary Abstractions:** Avoid complex wrappers, class hierarchies, or redundant state managers. Keep state close to where it is used.
- **Hard File Length Cap:** No single file may exceed **180 lines of code**. If a file approaches 160 lines, proactively decompose it into cohesive sub-modules.

---

## 2. Naming Standards
| Category | Convention | Examples |
|---|---|---|
| **Components** | `PascalCase` | `ActionCard.tsx`, `VentilationTimeline.tsx`, `StepLocationAQI.tsx` |
| **Custom Hooks** | `camelCase` with `use` prefix | `useAirQualityPlan.ts`, `useChoiceSimulator.ts` |
| **Utility Functions** | `camelCase` (descriptive verb) | `calculateInhaledPm25()`, `sanitizePromptInput()`, `isValidAirQualityPlan()` |
| **Types & Interfaces**| `PascalCase` | `HouseholdProfile`, `SmogActionItem`, `PersistedAppState` |
| **Type Unions** | `PascalCase` | `CommuteMode`, `ActionCategory`, `VentilationRiskLevel` |
| **Constants & Enums** | `UPPER_SNAKE_CASE` | `STORAGE_KEY`, `DEFAULT_HOUSEHOLD_PROFILE`, `MAX_CITY_LENGTH` |
| **Test Files** | Matching source with `.test.` | `impactMath.test.ts`, `ActionCard.test.tsx` |

---

## 3. TypeScript Guidelines
- **Strict Mode Enforced:** `tsconfig.json` has `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
- **Zero `any` Policy:** The `any` keyword is banned. Use `unknown` for untrusted payloads and validate with runtime type guards.
- **Explicit Return Types:** All exported functions and hooks must declare explicit return types.
```typescript
// Correct
export function calculateInhaledPm25(aqi: number, hoursOutdoor: number): number {
  return (aqi * 0.73) * (hoursOutdoor * 0.65);
}

// Prohibited
export function calculateInhaledPm25(aqi: any, hoursOutdoor: any) {
  return aqi * hoursOutdoor;
}
```

---

## 4. Component Structure & React 19 Patterns
- Use standard functional components with named `export function ComponentName()`.
- Place Props interface directly above the component.
- Keep JSX clean and declarative; avoid complex nested ternary expressions (extract to helper subcomponents or early returns).
- Always supply accessible labels and semantic roles.

```tsx
// Example of canonical component pattern:
import React from 'react';
import { SmogActionItem } from '../../types/airQuality';

interface ActionCardProps {
  action: SmogActionItem;
  onToggle: (id: string) => void;
}

export function ActionCard({ action, onToggle }: ActionCardProps): React.JSX.Element {
  return (
    <article
      className={`p-4 rounded-xl border transition-all ${
        action.enabled ? 'border-teal-600 bg-teal-50/40' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{action.title}</h3>
          <p className="mt-1 text-xs text-slate-600">{action.scientificRationale}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={action.enabled}
          onClick={() => onToggle(action.id)}
          className="px-3 py-1 text-xs font-medium rounded-md bg-teal-700 text-white"
        >
          {action.enabled ? 'Active' : 'Enable'}
        </button>
      </div>
    </article>
  );
}
```

---

## 5. Folder & Import Hierarchy
- Organize files strictly within designated directory layers:
  - `src/types/` — Type contracts only. No executable runtime code.
  - `src/utils/` — Pure algorithms and functions. No React hooks or network calls.
  - `src/services/` — I/O boundaries (Gemini SDK, `localStorage`, export generation).
  - `src/hooks/` — State orchestration connecting UI to services and utilities.
  - `src/components/common/` — Reusable, context-free visual building blocks.
  - `src/components/wizard/` — Multi-step onboarding components.
  - `src/components/dashboard/` — Feature widgets for the primary view.
- **Import Ordering:**
  1. React & third-party libraries (e.g., `react`, `lucide-react`)
  2. Types and interfaces (`../../types/airQuality`)
  3. Services and utilities (`../../services/...`, `../../utils/...`)
  4. Hooks (`../../hooks/...`)
  5. Sibling / child components (`./SubComponent`)

---

## 6. Error Handling Patterns
- **User-Facing Graceful Recovery:** Never crash to a white blank screen. All async service calls (Gemini API, Web Storage) must be wrapped in `try/catch` with automated fallback transitions.
- **UI Error Boundaries:** Wrap top-level dashboard sections with a clean Error Boundary displaying a recovery button ("Reload App").
- **Explanatory Error States:** If the AI engine cannot be reached, the UI must explain *what happened* in plain language and clearly demonstrate that the offline rules engine is safeguarding the user.

---

## 7. Comments & Documentation Standards
- Do not write comments that merely restate what code does (`// sets aqi to 100`).
- Use comments exclusively to document:
  - *Scientific or meteorological justification* (e.g., "WHO 24h PM2.5 threshold is 15 µg/m³; conversion factor 0.73 derives from standard EPA gravimetric cross-tables").
  - *Non-obvious trade-offs* (e.g., "Clamping AQI to 999 to prevent integer overflow in calculation models").
  - *Defensive constraints* (e.g., "Defensively strip control chars to neutralize prompt injection").

---

## 8. Formatting, Linting & Type Checking
- **Type Checking:** Run `npx tsc --noEmit` on every commit. Zero type errors allowed.
- **Linting:** Use `oxlint` for high-speed static code verification without bloated ESLint configuration plugins.
- **Line Width:** Soft wrap at 100 characters; hard cap at 120 characters.
- **Indentation:** 2 spaces (no hard tabs). Single quotes for JavaScript/TypeScript, double quotes for JSX attributes.

---

## 9. Explicit Do's and Don'ts

### DO:
- **DO** write unit tests for every math function in `src/utils/impactMath.ts`.
- **DO** ensure all interactive buttons have clear hover, active, and `:focus-visible` styles.
- **DO** verify that color combinations satisfy WCAG 2.1 AA contrast requirements.
- **DO** keep components under 180 lines of code.
- **DO** use `useMemo` for derived particulate metrics calculation.
- **DO** test fallback recovery paths when simulated API errors occur.

### DON'T:
- **DON'T** call `fetch()` or Gemini SDK directly from any component JSX file.
- **DON'T** use `any` type, type assertions with `as unknown as Type`, or `// @ts-ignore`.
- **DON'T** introduce external heavyweight styling or component libraries (e.g., MUI, Chakra, Bootstrap).
- **DON'T** install external state stores (Redux, MobX, Zustand) for an SPA easily managed with clean React hooks.
- **DON'T** use `dangerouslySetInnerHTML` under any circumstance.
- **DON'T** write unit tests that depend on live network or external Gemini API endpoints (always mock or test deterministic engines).

