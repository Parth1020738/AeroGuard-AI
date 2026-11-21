/**
 * Safe local storage utilities with defensive JSON serialization and error handling.
 * Handles storage quota limits, private browsing restrictions, and SSR environments.
 */

/**
 * Safely reads and deserializes an item from localStorage with fallback on error.
 * @param key - Storage key identifier.
 * @param fallback - Default value returned if key is missing or parsing fails.
 * @returns Parsed value of type T, or fallback on access/deserialization failure.
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
    console.warn(`[storage] Failed to read key "${key}" from localStorage:`, error);
    return fallback;
  }
}

/**
 * Safely serializes and persists an item to localStorage.
 * @param key - Storage key identifier.
 * @param value - Value to serialize and store.
 * @returns True if write succeeded, false on quota exceeded or access error.
 */
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

/**
 * Safely removes a key from localStorage.
 * @param key - Storage key identifier.
 * @returns True if removal succeeded, false on access error.
 */
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
