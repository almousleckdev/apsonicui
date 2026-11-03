// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadClient(env: Record<string, string | undefined> = {}) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) vi.stubEnv(key, '');
    else vi.stubEnv(key, value);
  }
  return import('@/services/api-client');
}

describe('apiClient on the server', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('does not wait and retry when the backend is unreachable', async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError('fetch failed');
    });
    vi.stubGlobal('fetch', fetchMock);
    const { apiClient } = await loadClient({ INTERNAL_API_URL: 'http://backend:8080' });

    const started = Date.now();
    await expect(apiClient('/news', { requiresAuth: false, silent: true })).rejects.toThrow();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(Date.now() - started).toBeLessThan(500);
  });

  it('calls the backend at INTERNAL_API_URL', async () => {
    const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify({ success: true, data: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { apiClient } = await loadClient({ INTERNAL_API_URL: 'http://backend:8080' });

    await apiClient('/news', { requiresAuth: false });

    expect(fetchMock.mock.calls[0][0]).toBe('http://backend:8080/api/v1/news');
  });
});
