# Design System — AeroGuard AI

## 1. Design Direction
- **Style:** Clean, calm, high-trust Environmental Health & Civic Technology UI.
- **Mood:** Professional, reassuring, scientific, actionable, and non-alarmist. Air pollution metrics naturally cause anxiety; the interface design counters this panic by providing clear, structured agency through calming deep teals, legible data cards, and purposeful micro-interactions.
- **Design Principles:**
  - *Clarity Over Panic:* Present severe data with clinical precision rather than alarming sensationalism.
  - *Immediate Actionability:* Every metric presented must tie directly to an actionable counter-measure.
  - *High-Contrast Accessibility:* Ensure immediate legibility in outdoor bright light or low-lit smoggy mornings.
  - *Consistent Rhythm:* All margins, padding, and alignments conform strictly to an 8-point base grid (4px micro-adjustments).

---

## 2. Brand
- **Brand Name:** AeroGuard AI
- **Tagline:** Intelligent Urban Smog Defense & Community Action
- **Logo Rules:**
  - The logo mark consists of an abstract stylized Shield enclosing a dynamic Wind/Breeze Curve (`ShieldCheck` or `Wind` from Lucide Icons).
  - Primary Logo: Deep Teal icon paired with `AeroGuard` in SemiBold Slate-900 and `AI` in Deep Teal Bold.
  - Minimum clear space around logo: 16px (1rem).
- **Brand Voice:** Authoritative, compassionate, protective, scientifically grounded, and civic-minded. Plain-language health guidance without medical jargon.

---

## 3. Color Palette

### Core Tokens (HEX Codes)
| Token Name | Tailwind v4 Equivalent | HEX Code | Usage |
|---|---|---|---|
| **Primary Deep Teal** | `teal-700` | `#0F766E` | Primary buttons, active states, key accents, brand header |
| **Primary Hover** | `teal-800` | `#115E59` | Hover states for primary interactive elements |
| **Primary Light** | `teal-50` | `#F0FDFA` | Light tint backgrounds for primary cards and badges |
| **Secondary Sky Slate** | `sky-600` | `#0284C7` | Links, informational highlights, secondary indicators |
| **Background** | `slate-50` | `#F8FAFC` | Global page background |
| **Surface** | `white` | `#FFFFFF` | Cards, modals, dropdown surfaces, navigation bars |
| **Surface Subdued** | `slate-100` | `#F1F5F9` | Table headers, secondary card panels, inset containers |
| **Text Primary** | `slate-900` | `#0F172A` | Primary headings, body copy, key data values |
| **Text Muted** | `slate-600` | `#475569` | Secondary captions, helper copy, subtitles |
| **Border** | `slate-200` | `#E2E8F0` | Dividers, card boundaries, input borders |
| **Border Focused** | `teal-600` | `#0D9488` | Active input boundaries, ring focus states |
| **Success** | `green-700` | `#15803D` | Favorable metrics, safe ventilation windows, completed actions |
| **Warning** | `amber-700` | `#B45309` | Moderate smog advisories, caution notices, partial compliance |
| **Error / Critical** | `red-700` | `#B91C1C` | Severe smog hazard alerts, validation errors, lockdown alerts |

### AQI Severity Badges (Standardized Environmental Scale)
| AQI Range | Tier Label | Badge Background | Badge Text | Border Color | Meaning |
|---|---|---|---|---|---|
| **0 – 50** | **Good** | `#DCFCE7` (`green-100`) | `#166534` (`green-800`) | `#86EFAC` (`green-300`) | Air is clean and safe for all |
| **51 – 100** | **Moderate** | `#FEF9C3` (`yellow-100`) | `#854D0E` (`yellow-800`) | `#FDE047` (`yellow-300`) | Sensitive groups take mild caution |
| **101 – 200** | **Poor / Unhealthy** | `#FFEDD5` (`orange-100`) | `#9A3412` (`orange-800`) | `#FDBA74` (`orange-300`) | N95 recommended; limit outdoor exertion |
| **201 – 300** | **Very Poor** | `#FEE2E2` (`red-100`) | `#991B1B` (`red-800`) | `#FCA5A5` (`red-300`) | Health alert; keep windows shut |
| **301 – 500+** | **Severe / Hazardous** | `#F3E8FF` (`purple-100`) | `#6B21A8` (`purple-800`) | `#D8B4FE` (`purple-300`) | Emergency lockdown; run indoor air scrubbers |

---

## 4. Typography
- **Primary Font Family:** `Inter`, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Display / Heading Family:** `Plus Jakarta Sans`, `Inter`, sans-serif.

### Scale & Hierarchy
| Level | Font Size | Line Height | Font Weight | Tracking | Typical CSS Classes |
|---|---|---|---|---|---|
| **Hero Title** | 36px (2.25rem) | 44px (2.75rem) | 700 (Bold) | -0.025em | `text-3xl sm:text-4xl font-bold tracking-tight text-slate-900` |
| **H1 Section** | 28px (1.75rem) | 36px (2.25rem) | 700 (Bold) | -0.02em | `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900` |
| **H2 Card Title**| 20px (1.25rem) | 28px (1.75rem) | 600 (SemiBold) | -0.01em | `text-xl font-semibold text-slate-900` |
| **H3 Subheading**| 16px (1.00rem) | 24px (1.50rem) | 600 (SemiBold) | normal | `text-base font-semibold text-slate-800` |
| **Body Standard**| 15px (0.9375rem)| 24px (1.50rem) | 400 (Regular) | normal | `text-sm sm:text-base text-slate-700 leading-relaxed` |
| **Body Small** | 13px (0.8125rem)| 20px (1.25rem) | 400 (Regular) | normal | `text-xs sm:text-sm text-slate-600` |
| **Micro Caption**| 11px (0.6875rem)| 16px (1.00rem) | 500 (Medium) | +0.02em | `text-xs font-medium text-slate-500 uppercase tracking-wider` |
| **Data Metric** | 32px (2.00rem) | 36px (2.25rem) | 800 (ExtraBold) | -0.03em | `text-2xl sm:text-3xl font-extrabold text-teal-700 tabular-nums` |

---

## 5. Spacing Scale (8-Point Grid with 4px Sub-Unit)
- `4px` (`0.25rem` / `p-1`): Micro gaps, badge internal vertical padding.
- `8px` (`0.50rem` / `p-2`): Compact padding, button horizontal gap, tag margins.
- `12px` (`0.75rem` / `p-3`): Standard button vertical padding, form input spacing.
- `16px` (`1.00rem` / `p-4`): Standard card internal padding on mobile, item list gaps.
- `24px` (`1.50rem` / `p-6`): Desktop card padding, section gap.
- `32px` (`2.00rem` / `p-8`): Major section layout gaps, modal padding.
- `48px` (`3.00rem` / `p-12`): Page header bottom spacing.
- `64px` (`4.00rem` / `p-16`): Main view vertical padding.

---

## 6. Border Radius
- **Small (`rounded-sm`):** `4px` — Checkbox squares, progress bar track.
- **Medium (`rounded-md`):** `6px` — Form inputs, select dropdowns, tooltip containers.
- **Large (`rounded-lg`):** `8px` — Buttons, alert banners, secondary cards.
- **Extra Large (`rounded-xl`):** `12px` — Dashboard cards, interactive metric widgets.
- **Full Pill (`rounded-full`):** `9999px` — AQI severity badges, status chips, toggle switches.

---

## 7. Shadows
- **Card Subtle (`shadow-sm`):** `0 1px 2px 0 rgb(0 0 0 / 0.05)` — Static content cards and form panels.
- **Card Interactive (`shadow-md`):** `0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)` — Hover state for action cards and preset buttons.
- **Elevation Modal (`shadow-xl`):** `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` — Floating dialogs and sticky impact summary bar.

---

## 8. Buttons

### Primary Button
- **Classes:** `inline-flex items-center justify-center px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-lg shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`
- **Use Case:** "Generate Plan", "Save & Continue", "Download JSON".

### Secondary / Outline Button
- **Classes:** `inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-300 rounded-lg shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-50`
- **Use Case:** "Back", "Reset Profile", "Print Advisory".

### Danger / Reset Button
- **Classes:** `inline-flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium text-sm border border-red-200 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-600`
- **Use Case:** "Clear Stored Profile".

### Loading State
- Include an animated spinning `Loader2` icon (Lucide) with `animate-spin mr-2 h-4 w-4` and label like "Generating Clean-Air Plan...". Set `aria-busy="true"` and `disabled`.

---

## 9. Form Inputs & Controls
- **Standard Input & Select:**
  - `block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-sm transition-all`
- **Label:**
  - `block text-sm font-medium text-slate-800 mb-1.5`
- **Helper / Error Text:**
  - Helper: `mt-1.5 text-xs text-slate-500`
  - Error: `mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1`
- **Interactive Action Toggle Checkbox:**
  - Custom styled pill container with `role="checkbox"` and `aria-checked="true|false"` with smooth transition to teal border and checkmark highlight.

---

## 10. Cards & Panels
- **Standard Card Container:**
  - `bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-md`
- **Card Header:**
  - `flex items-center justify-between pb-4 mb-4 border-b border-slate-100`
- **Interactive Choice Card:**
  - Selected: `bg-teal-50/50 border-teal-500 ring-1 ring-teal-500`
  - Unselected: `bg-white border-slate-200 hover:border-slate-300`

---

## 11. Navigation & App Bar
- **Header:** Sticky top bar `sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between`.
- **Branding:** Left-aligned logo with `AeroGuard AI` title and live status chip ("Offline Ready").
- **Navigation Controls:** Right-aligned actions ("Edit Profile", "Export JSON", "Print Advisory").

---

## 12. Component States

### Loading State (Skeleton)
- Animated shimmering pulse (`animate-pulse bg-slate-200 rounded-md`). Never show blank unstyled boxes during Gemini API requests.
- Provide accessible text: `<span className="sr-only">Analyzing air quality data...</span>`.

### Empty State
- Centered container with muted illustration icon (`Wind` or `CloudFog` in `slate-400`), crisp headline ("No Household Profile Found"), supporting paragraph, and primary CTA button ("Start Onboarding Wizard").

### Error State
- High-visibility banner with light red background (`bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg`), containing warning icon, clear title ("Unable to Reach Live AI Engine"), human-readable explanation, and one-click action ("Use Offline Expert Plan").

### Success State
- Temporary toast notifications or check badges in `bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 flex items-center gap-2`.

---

## 13. Icons
- **Icon Library:** `lucide-react` (clean, accessible SVG icons).
- **Default Sizing:** 18px (`h-4.5 w-4.5`) or 20px (`h-5 w-5`).
- **Core Semantic Icons:**
  - `ShieldCheck` / `ShieldAlert`: Safety and protection status.
  - `Wind` / `CloudFog`: Smog and air movement.
  - `Activity`: Respiratory rate, PM2.5 inhalation calculation.
  - `Leaf`: Sustainable alternatives, CO₂ reduction.
  - `Home`: Indoor air quality hacks.
  - `Clock`: Ventilation window timeline.
  - `Share2` / `Printer`: Community card advisory distribution.
  - `CheckCircle2` / `AlertTriangle`: Status alerts.

---

## 14. Responsive Breakpoints
- **Mobile (`< 640px`):** Single column stacked layout. Wizard steps span full width. Floating sticky impact summary pinned to the bottom.
- **Tablet (`640px – 1023px`):** 2-column grid for action categories; timeline horizontal scroll.
- **Desktop (`>= 1024px`):** 3-column dashboard grid (Routines, Indoor Hacks, Sustainable Alternatives) with sidebar impact simulator and timeline at top.
- **Max Container Width:** `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`.

---

## 15. Strict Accessibility (WCAG 2.1 AA Compliance)
1. **Semantic HTML:** Use `<main>`, `<header>`, `<section>`, `<article>`, `<nav>`, and `<aside>` appropriately.
2. **Accessible Labels:** Every form input has an explicit `<label htmlFor="id">` matching `<input id="id">`.
3. **Contrast Ratios:** All text elements exceed the 4.5:1 minimum contrast ratio against their respective backgrounds (e.g., `#0F766E` on `#FFFFFF` is 5.4:1; `#0F172A` on `#FFFFFF` is 16.1:1).
4. **Keyboard Operability:** Every interactive element can be focused and activated via `Tab`, `Shift+Tab`, `Space`, and `Enter`.
5. **Visible Focus Rings:** Never disable outline without providing an explicit replacement. Use `focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2`.
6. **ARIA Live Regions:** Dynamic recalculations of PM2.5 and CO₂ metrics announce updates to screen readers using `aria-live="polite"` and `role="status"`.
7. **Color Independence:** Never communicate air quality severity exclusively through color; always pair badges with descriptive text labels ("Severe AQI 420", "Moderate AQI 85") and distinct icon markers.

