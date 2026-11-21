/**
 * Lightweight, type-safe HTTP client with AbortController timeout management
 * and defensive JSON response parsing.
 */

/**
 * Parses raw JSON string into typed payload safely.
 * @param raw - The JSON string to parse.
 * @returns Typed data structure parsed from JSON.
 * @throws Error when JSON string is malformed or invalid.
 */
export function safeParseJson<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error('Failed to parse response as JSON');
  }
}

/**
 * Performs HTTP fetch request with AbortController timeout enforcement and JSON parsing.
 * @param url - Destination endpoint URL.
 * @param timeoutMs - Maximum milliseconds before aborting the request.
 * @param init - Optional RequestInit configuration overrides.
 * @returns Promise resolving to the parsed response payload.
 * @throws Error on non-OK HTTP status, timeout abort, or malformed JSON.
 */
export async function fetchJsonWithTimeout<T>(
  url: string,
  timeoutMs: number,
  init?: RequestInit
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: init?.signal ?? controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP request failed with status ${response.status}`);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new Error('Failed to parse response as JSON');
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
