/**
 * Safe local storage utilities with defensive JSON serialization and error handling
 * Handles storage quota limits, private browsing restrictions, and SSR environments.
 */

export function safeGetStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    // Non-blocking fallback for JSON parse or access issues
    console.warn(`[storage] Failed to read key "${key}" from localStorage:`, error);
    return fallback;
  }
}

export function safeSetStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn(`[storage] Failed to write key "${key}" to localStorage:`, error);
    return false;
  }
}

export function safeRemoveStorage(key: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[storage] Failed to remove key "${key}" from localStorage:`, error);
    return false;
  }
}
