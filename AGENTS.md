# AI Coding Agent Instructions — AeroGuard AI

## 1. Project Context
- **Project:** AeroGuard AI (Hack2Skill PromptWars Virtual Challenge 06: Urban Air Quality Assistant)
- **Purpose:** GenAI-powered urban air quality assistant that empowers urban families and neighborhood/school community organizers to navigate severe winter smog and chronic air pollution. It generates hyper-localized, budget-conscious daily routines, indoor air quality hacks, and sustainable low-emission alternatives while quantifying the direct impact of user choices (PM2.5 inhalation reduction, CO₂ emissions prevented).
- **Primary Users:** Urban families (especially households with children, seniors, or respiratory/asthma vulnerabilities) and community/school organizers in high-smog urban centers.
- **Technology Stack:** Client-Side Single Page Application (SPA) powered by React 19, TypeScript (`strict: true`), Vite, Tailwind CSS v4, `@google/generative-ai` (`gemini-2.5-flash`), Vitest + React Testing Library, and oxlint.

## 2. Source of Truth
**CRITICAL DIRECTIVE:** Before planning or modifying any code in this repository, you MUST read all technical documentation files located inside the `/docs` directory. Every architectural rule, interface contract, and design token documented here is binding.

The canonical core documents are:
1. `docs/PRD.md` — Product Requirements Document (features, acceptance criteria, edge cases, scope, metrics)
2. `docs/DESIGN_SYSTEM.md` — Visual language, colors, typography, spacing, WCAG 2.1 AA accessibility, and component states
3. `docs/ARCHITECTURE.md` — System architecture, module boundaries, data flow, failure recovery, and directory layout
4. `docs/DATABASE.md` — Client persistence schema (`localStorage`), strict domain models, validation, and seed data
5. `docs/SECURITY.md` — LLM prompt sanitization, API key hygiene, content security, and safe logging policies
6. `docs/CODE_STYLE.md` — TypeScript strict rules, naming standards, file line caps (<180 lines), and error handling patterns
7. `docs/TESTING.md` — Vitest test requirements, verification commands, coverage targets, and test cases
8. `docs/UX_FLOWS.md` — User journeys, state transitions (loading/empty/error/success), and interaction flows
9. `docs/API.md` — Gemini 2.5 Flash API contract, structured prompt/JSON schemas, retry policies, and fallback mechanics

**Do not contradict these documents without first identifying the conflict and documenting the explicit resolution.**

## 3. General Rules
- **Inspect First:** Read existing files and understand surrounding context before attempting any edits.
- **Pure Client Architecture:** Never attempt to introduce a separate server, database daemon, or backend auth container. Everything operates in the client SPA using browser `localStorage` and client-side Google Gemini SDK calls.
- **Service-Hook Isolation:** UI components must NEVER invoke the Gemini API or access `localStorage` directly. All API operations belong in `src/services/` and all state orchestrations belong in `src/hooks/`.
- **Pure Functions for Math:** All PM2.5 inhalation reduction, AQI categorization, and CO₂ savings calculations must reside in pure, testable utility functions under `src/utils/`.
- **File Length Hard Cap:** No single file may exceed 180 lines of code. Decompose complex components into smaller modular subcomponents.
- **Zero Hallucination of Business Logic:** Implement strictly what is defined in `docs/PRD.md`. Do not add unsolicited mock authentication or paid IoT hardware sync integrations.
- **No Secret Exposure:** Never hardcode API keys or commit secrets. Use `import.meta.env.VITE_GEMINI_API_KEY`.
- **Minimalist Dependencies:** Do not add third-party styling frameworks, redundant state libraries (like Redux), or heavyweight runtime dependencies.
- **No Fake Claims:** Always verify and execute real checks. Never claim tests passed or lint succeeded unless actually run and verified.

## 4. 7-Step Planning Protocol
Before implementing any non-trivial feature or refactoring task, follow this exact sequence:
1. **Inspect Relevant Documentation:** Re-read the corresponding section in `docs/` (`PRD.md`, `ARCHITECTURE.md`, etc.).
2. **Inspect Relevant Code:** Examine affected components, hooks, utilities, and tests in `src/`.
3. **Identify Affected Files:** List every file that will be created, modified, or deleted.
4. **Identify Dependencies:** Check whether new utilities, interfaces, or domain types are needed.
5. **Identify Storage/Schema Changes:** Verify if `aeroguard_state_v1` in `src/types/airQuality.ts` requires updates.
6. **Identify Tests Required:** Define unit/integration test cases that must accompany the change in `tests/`.
7. **Create a Concise Implementation Plan:** Outline the steps and verify alignment against the 6 Evaluation Pillars (Code Quality, Security, Efficiency, Testing, Accessibility, Problem Alignment).

## 5. Implementation Rules
- Write clean, self-documenting code with explicit TypeScript types (`strict: true`, zero `any`).
- Follow the single responsibility principle: one component/function per file.
- Enforce full keyboard navigation and WCAG 2.1 AA accessibility (proper labels, ARIA attributes, visible focus indicators).
- Keep changes atomic and preserve backward compatibility with persisted client profiles.
- When handling AI responses, always validate payloads with strict runtime schema guards before rendering.

## 6. Validation Gate
Every code change must pass the automated validation pipeline before being deemed complete. Run each of these commands sequentially:

```bash
# 1. Type verification
npx tsc --noEmit

# 2. Linting & syntax verification
npm run lint

# 3. Unit and integration test suite
npm run test

# 4. Production build bundle verification
npm run build
```

If any command fails, halt immediately, diagnose the root cause, apply a focused fix, and re-run all 4 steps.

## 7. Documentation Synchronization
Keep documentation in sync with implementation changes:
- Update `docs/PRD.md` if feature scope or user-facing assumptions evolve.
- Update `docs/ARCHITECTURE.md` if folder boundaries or component relationships shift.
- Update `docs/DATABASE.md` if data entity attributes or storage formats are modified.
- Update `docs/API.md` if LLM prompt definitions or response JSON schemas are altered.
- Update `docs/TESTING.md` when new critical test suites are introduced.

## 8. Conflict Handling
If user requests or existing codebase patterns conflict with the documentation:
1. Do not make silent assumptions or unverified guesses.
2. Formulate the exact contradiction clearly, referencing the file and line number.
3. Propose the safest, minimal-risk path forward that preserves security, type-safety, and offline fallback resilience.

## 9. Completion Criteria
A task or user request is strictly considered complete only when:
- [ ] All functional requirements specified in `docs/PRD.md` are satisfied.
- [ ] All unit and integration tests pass with 100% pass rate (`npm run test`).
- [ ] Type check passes with zero errors (`npx tsc --noEmit`).
- [ ] Lint passes with zero warnings or errors (`npm run lint`).
- [ ] Production build succeeds without bundle bloat (`npm run build`, bundle <150KB gzip).
- [ ] WCAG 2.1 AA accessibility standards are satisfied (semantic HTML, keyboard navigable, screen-reader announced).
- [ ] Zero sensitive keys or unescaped user inputs are exposed.
- [ ] Documentation reflects the current state of the application.

