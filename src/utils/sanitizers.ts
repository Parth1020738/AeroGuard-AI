import { AirQualityPlan, SmogActionItem, VentilationWindow } from '../types/airQuality';

const VALID_CATEGORIES = new Set([
  'low_emission_routine',
  'iaq_hack',
  'sustainable_alternative',
]);

const VALID_COSTS = new Set(['free', 'low', 'moderate']);
const VALID_DIFFICULTIES = new Set(['easy', 'medium']);
const VALID_RISKS = new Set(['lockdown', 'caution', 'safe']);
const VALID_TRENDS = new Set(['peaking', 'rising', 'moderate', 'falling']);

/**
 * Strips ASCII control characters (0-31, 127) and collapses whitespaces.
 * Enforces length ceiling to neutralize OWASP LLM01 prompt injection attempts.
 */
export function sanitizePromptInput(input: string, maxLength = 80): string {
  if (typeof input !== 'string') return '';
  // Strip ASCII control characters (0-31, 127) and zero-width spaces without triggering no-control-regex
  let cleaned = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    // Ignore control chars 0-31, DEL 127, and zero-width spaces
    if ((code >= 0 && code <= 31) || code === 127 || (code >= 0x200b && code <= 0x200d) || code === 0xfeff) {
      continue;
    }
    cleaned += input[i];
  }

  return cleaned
    .replace(/```|system:|assistant:|user:/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Strips path traversal characters, illegal file symbols, and returns safe filename.
 */
export function sanitizeFileName(name: string): string {
  if (typeof name !== 'string') return 'aeroguard-smog-plan';
  const clean = name
    .toLowerCase()
    .replace(/\.\./g, '')
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

  return clean.length > 0 ? clean : 'aeroguard-smog-plan';
}

function isValidActionItem(item: unknown): item is SmogActionItem {
  if (!item || typeof item !== 'object') return false;
  const a = item as Partial<SmogActionItem>;
  return (
    typeof a.id === 'string' &&
    a.id.trim().length > 0 &&
    typeof a.title === 'string' &&
    a.title.trim().length > 0 &&
    typeof a.category === 'string' &&
    VALID_CATEGORIES.has(a.category) &&
    Array.isArray(a.steps) &&
    a.steps.length > 0 &&
    a.steps.every((s) => typeof s === 'string' && s.trim().length > 0) &&
    typeof a.costLevel === 'string' &&
    VALID_COSTS.has(a.costLevel) &&
    typeof a.difficulty === 'string' &&
    VALID_DIFFICULTIES.has(a.difficulty) &&
    typeof a.scientificRationale === 'string' &&
    a.scientificRationale.trim().length > 0 &&
    typeof a.pm25ReductionUg === 'number' &&
    !Number.isNaN(a.pm25ReductionUg) &&
    a.pm25ReductionUg >= 0 &&
    typeof a.weeklyCo2SavedKg === 'number' &&
    !Number.isNaN(a.weeklyCo2SavedKg) &&
    a.weeklyCo2SavedKg >= 0
  );
}

function isValidVentilationWindow(win: unknown): win is VentilationWindow {
  if (!win || typeof win !== 'object') return false;
  const w = win as Partial<VentilationWindow>;
  return (
    typeof w.hourRange === 'string' &&
    w.hourRange.trim().length > 0 &&
    typeof w.riskLevel === 'string' &&
    VALID_RISKS.has(w.riskLevel) &&
    typeof w.title === 'string' &&
    w.title.trim().length > 0 &&
    typeof w.instruction === 'string' &&
    w.instruction.trim().length > 0 &&
    typeof w.ambientAqiTrend === 'string' &&
    VALID_TRENDS.has(w.ambientAqiTrend)
  );
}

/**
 * Runtime type guard validating untrusted JSON payloads into AirQualityPlan.
 */
export function isValidAirQualityPlan(data: unknown): data is AirQualityPlan {
  if (!data || typeof data !== 'object') return false;
  const p = data as Partial<AirQualityPlan>;

  const hasPrimitives =
    typeof p.planId === 'string' &&
    p.planId.trim().length > 0 &&
    typeof p.city === 'string' &&
    p.city.trim().length > 0 &&
    typeof p.baselineOutdoorAqi === 'number' &&
    !Number.isNaN(p.baselineOutdoorAqi) &&
    p.baselineOutdoorAqi >= 0 &&
    p.baselineOutdoorAqi <= 999 &&
    typeof p.summaryHeadline === 'string' &&
    p.summaryHeadline.trim().length > 0 &&
    typeof p.communityAdvisoryText === 'string' &&
    p.communityAdvisoryText.trim().length > 0 &&
    Array.isArray(p.actions) &&
    Array.isArray(p.ventilationTimeline);

  if (!hasPrimitives) return false;

  const actions = p.actions ?? [];
  const windows = p.ventilationTimeline ?? [];

  if (actions.length < 3 || windows.length < 2) return false;

  return actions.every(isValidActionItem) && windows.every(isValidVentilationWindow);
}
