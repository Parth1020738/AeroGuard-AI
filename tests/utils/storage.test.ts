import { describe, it, expect, beforeEach, vi } from 'vitest';
import { safeGetStorage, safeSetStorage, safeRemoveStorage } from '../../src/utils/storage';

describe('storage utility', () => {
  const TEST_KEY = 'aeroguard_test_key';

  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns fallback when item is not found in localStorage', () => {
    const result = safeGetStorage(TEST_KEY, { defaultVal: 42 });
    expect(result).toEqual({ defaultVal: 42 });
  });

  it('successfully sets and retrieves structured data', () => {
    const payload = { city: 'Delhi', aqi: 420 };
    const success = safeSetStorage(TEST_KEY, payload);
    expect(success).toBe(true);

    const retrieved = safeGetStorage(TEST_KEY, { city: '', aqi: 0 });
    expect(retrieved).toEqual(payload);
  });

  it('returns fallback and does not crash when storage has malformed JSON', () => {
    window.localStorage.setItem(TEST_KEY, 'invalid-json-{broken');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = safeGetStorage(TEST_KEY, { safe: true });
    expect(result).toEqual({ safe: true });
    expect(warnSpy).toHaveBeenCalled();
  });

  it('handles write failure gracefully when storage throws', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const success = safeSetStorage(TEST_KEY, { test: 123 });
    expect(success).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('successfully removes items from localStorage', () => {
    safeSetStorage(TEST_KEY, 'value');
    expect(safeGetStorage(TEST_KEY, '')).toBe('value');

    const removed = safeRemoveStorage(TEST_KEY);
    expect(removed).toBe(true);
    expect(safeGetStorage(TEST_KEY, 'none')).toBe('none');
  });
});
