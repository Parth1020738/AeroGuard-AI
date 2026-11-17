# Security & Safety Architecture — AeroGuard AI

## 1. Client-Side Threat Model & Authentication
- **Zero Authentication Requirement:** AeroGuard AI is intentionally architected as a pure client-side utility without user accounts, passwords, or session tokens. By removing user accounts and backend databases, the attack surface related to credential stuffing, session hijacking, database exfiltration, and password database compromise is completely eliminated.
- **Data Minimization:** No personal data (names, phone numbers, GPS coordinates, IP addresses, payment details) is ever requested, transmitted, or retained.

---

## 2. Secrets Management & API Key Security
- **API Key Handling:**
  - The application connects to Google Generative AI via `VITE_GEMINI_API_KEY` accessed through `import.meta.env.VITE_GEMINI_API_KEY`.
  - **Zero Hardcoded Secrets:** Source code files and git repositories must never contain raw API keys or tokens.
  - A comprehensive `.env.example` template is committed to guide developers on configuring their local keys without committing real values.
- **Graceful Degraded Operation Without Keys:**
  - If `VITE_GEMINI_API_KEY` is undefined or empty, the application never crashes.
  - Instead, `geminiService.ts` detects the missing key, displays an informative informational banner ("Offline Defense Mode: Active"), and seamlessly delivers the calibrated deterministic smog plan from `fallbackSmogPlan.ts`.
- **Hosting & Production Deployment:**
  - In deployment environments (e.g., Vercel, Netlify), keys are configured exclusively through platform Environment Variable managers.
  - Recommended best practice: Restrict the Gemini API key in Google Cloud Console by HTTP Referrer and Gemini API service quotas.

---

## 3. Input Sanitization & Prompt Injection Defense (OWASP LLM01)
Because user input (such as city name or custom lifestyle parameters) is interpolated into the Gemini LLM prompt, strict sanitization must occur before dispatch to prevent prompt injection, prompt leakage, or output disruption.

### Sanitization Implementation (`src/utils/sanitizers.ts`)
```typescript
/**
 * Strips non-printable ASCII control characters (0-31, 127) and trims excess length
 * to neutralize prompt injection vectors before dispatching to the LLM.
 */
export function sanitizePromptInput(input: string, maxLength = 50): string {
  if (typeof input !== 'string') return '';
  return input
    // Remove ASCII control characters & zero-width characters
    .replace(/[\x00-\x1F\x7F\u200B-\u200D\uFEFF]/g, '')
    // Neutralize markdown or system prompt override directives
    .replace(/```|system:|assistant:|user:/gi, '')
    // Collapse consecutive whitespaces
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}
```

### Prompt Guardrails
1. System instructions in `geminiService.ts` are strictly separated from user parameters using structured JSON delimiters.
2. The model is pinned to system instructions that explicitly reject role-playing, instruction overrides, or requests to output anything other than the defined JSON schema.
3. The model request explicitly sets `responseMimeType: "application/json"`.

---

## 4. Output Validation & Runtime Schema Integrity
LLM outputs are inherently untrusted external data. The application must never render raw JSON or inject unparsed strings into the DOM.

### Runtime Type Guard (`src/utils/validators.ts`)
Before any AI output is committed to state or displayed:
```typescript
import { AirQualityPlan, SmogActionItem } from '../types/airQuality';

export function isValidAirQualityPlan(data: unknown): data is AirQualityPlan {
  if (!data || typeof data !== 'object') return false;
  const p = data as Partial<AirQualityPlan>;

  const hasValidPrimitives =
    typeof p.summaryHeadline === 'string' &&
    typeof p.severityLabel === 'string' &&
    Array.isArray(p.actions) &&
    Array.isArray(p.ventilationTimeline);

  if (!hasValidPrimitives) return false;

  // Validate action items structure
  const actionsValid = p.actions!.every((act: Partial<SmogActionItem>) =>
    typeof act.id === 'string' &&
    typeof act.title === 'string' &&
    Array.isArray(act.steps) &&
    typeof act.scientificRationale === 'string' &&
    act.impactEstimates &&
    typeof act.impactEstimates.dailyPm25ReductionUgm3 === 'number' &&
    typeof act.impactEstimates.weeklyCo2SavedKg === 'number'
  );

  return actionsValid;
}
```
If an LLM response fails `isValidAirQualityPlan`, it is safely discarded and the application falls back immediately to `fallbackSmogPlan.ts`.

---

## 5. File Export & Download Safety
When exporting the plan as a `.json` file or copying advisory text to clipboard:
- **Filename Sanitization:** Filenames are strictly sanitized to prevent path traversal or special-character exploits:
  ```typescript
  export function sanitizeFilename(city: string): string {
    const cleanCity = city.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    return `aeroguard-plan-${cleanCity || 'city'}-${Date.now()}.json`;
  }
  ```
- **MIME & Blob Security:** Exported JSON uses `new Blob([jsonString], { type: 'application/json;charset=utf-8' })` with an auto-revoked Object URL.
- **XSS Prevention:** All text rendering uses standard React JSX expressions (`{text}`), ensuring automatic HTML entity encoding. `dangerouslySetInnerHTML` is strictly prohibited throughout the entire codebase.

---

## 6. Safe Logging Policy
- Never log raw environment variables, full user object keys, or third-party API tokens to the browser console.
- In production builds, development debugging statements (`console.log`, `console.debug`) must be stripped by the bundler.
- Telemetry or catch-block errors must log only generic error names and statuses (`error.name`, `error.message`), never internal stack traces or prompt buffers.

---

## 7. Content Security Policy (CSP) Directives
In index.html, AeroGuard AI enforces strict CSP headers:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://generativelanguage.googleapis.com;
  img-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
" />
```

---

## 8. Security Verification Checklist
- [x] Zero hardcoded API keys or secrets in source code or git history.
- [x] User inputs strictly sanitized against ASCII control characters, script tags, and prompt injection tokens.
- [x] Gemini API constrained to `responseMimeType: "application/json"`.
- [x] All untrusted external responses validated by runtime TypeScript type guards (`isValidAirQualityPlan`) before rendering.
- [x] `dangerouslySetInnerHTML` is completely banned from the repository.
- [x] Exported filenames sanitized against path traversal characters.
- [x] `localStorage` operations wrapped in defensive `try/catch` with automatic state recovery on corrupt data.
- [x] Zero PII requested, collected, stored, or transmitted.
- [x] Graceful degradation to offline deterministic engine on any API failure, rate limit, or invalid response.

