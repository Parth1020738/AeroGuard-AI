import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchJsonWithTimeout, safeParseJson } from '../../src/utils/httpClient';

describe('httpClient utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('safeParseJson', () => {
    it('parses valid JSON string into typed data', () => {
      const data = safeParseJson<{ name: string; score: number }>('{"name":"AeroGuard","score":95}');
      expect(data).toEqual({ name: 'AeroGuard', score: 95 });
    });

    it('throws descriptive error on malformed JSON', () => {
      expect(() => safeParseJson('{invalid-json}')).toThrow('Failed to parse response as JSON');
    });
  });

  describe('fetchJsonWithTimeout', () => {
    it('successfully fetches and deserializes JSON on 200 OK', async () => {
      const mockPayload = { status: 'healthy', aqi: 150 };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      } as Response);

      const result = await fetchJsonWithTimeout<typeof mockPayload>(
        'https://api.example.com/status',
        5000
      );

      expect(result).toEqual(mockPayload);
    });

    it('throws descriptive error when HTTP status is not OK (e.g. 404)', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(
        fetchJsonWithTimeout('https://api.example.com/not-found', 5000)
      ).rejects.toThrow('HTTP request failed with status 404');
    });

    it('throws descriptive error when JSON parsing fails on invalid body', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Unexpected token');
        },
      } as unknown as Response);

      await expect(
        fetchJsonWithTimeout('https://api.example.com/bad-json', 5000)
      ).rejects.toThrow('Failed to parse response as JSON');
    });

    it('aborts and throws descriptive timeout error when request exceeds timeoutMs', async () => {
      vi.useFakeTimers();

      vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          });
        });
      });

      const promise = fetchJsonWithTimeout('https://api.example.com/hang', 1500);
      vi.advanceTimersByTime(1600);

      await expect(promise).rejects.toThrow('Request timed out after 1500ms');
    });
  });
});
