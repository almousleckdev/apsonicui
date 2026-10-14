// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ok = (data: unknown) => new Response(JSON.stringify({ success: true, data }), { status: 200 });
const status = (code: number) => new Response(JSON.stringify({ message: 'nope' }), { status: code });

type Handler = (url: string, init: RequestInit) => Response | Promise<Response>;

function stubFetch(handler: Handler) {
  const calls: { url: string; init: RequestInit; headers: Headers }[] = [];
  const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
    calls.push({ url, init, headers: new Headers(init.headers) });
    return handler(url, init);
  });
  vi.stubGlobal('fetch', fetchMock);
  return calls;
}

async function loadClient() {
  vi.resetModules();
  const client = await import('@/services/api-client');
  const { tokenStorage } = await import('@/services/token-storage');
  return { ...client, tokenStorage };
}

const refreshCalls = (calls: { url: string }[]) => calls.filter((c) => c.url.endsWith('/auth/refresh'));

describe('apiClient', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the CSRF header and credentials on every request', async () => {
    const calls = stubFetch(() => ok({}));
    const { apiClient } = await loadClient();

    await apiClient('/news', { requiresAuth: false });

    expect(calls[0].headers.get('X-Requested-With')).toBe('apsonic-web');
    expect(calls[0].init.credentials).toBe('include');
  });

  it('attaches the bearer token only to authenticated requests', async () => {
    const calls = stubFetch(() => ok({}));
    const { apiClient, tokenStorage } = await loadClient();
    tokenStorage.setAccessToken('tok-1');

    await apiClient('/admin/news');
    await apiClient('/news', { requiresAuth: false });

    expect(calls[0].headers.get('Authorization')).toBe('Bearer tok-1');
    expect(calls[1].headers.get('Authorization')).toBeNull();
  });

  it('on 401 refreshes the session once and retries with the new token', async () => {
    let first = true;
    const calls = stubFetch((url, init) => {
      if (url.endsWith('/auth/refresh')) return ok({ accessToken: 'fresh' });
      if (first) {
        first = false;
        return status(401);
      }
      return ok({ id: 7 });
    });
    const { apiClient, tokenStorage } = await loadClient();
    tokenStorage.setAccessToken('expired');

    const res = await apiClient<{ id: number }>('/admin/products');

    expect(res.data).toEqual({ id: 7 });
    expect(refreshCalls(calls)).toHaveLength(1);
    const refresh = refreshCalls(calls)[0];
    expect(refresh.init.method).toBe('POST');
    expect(refresh.headers.get('X-Requested-With')).toBe('apsonic-web');
    expect(calls.at(-1)!.headers.get('Authorization')).toBe('Bearer fresh');
    expect(tokenStorage.getAccessToken()).toBe('fresh');
  });

  it('shares one refresh between parallel 401s (the refresh token rotates, so it must not be sent twice)', async () => {
    const seen = new Set<string>();
    const calls = stubFetch(async (url, init) => {
      if (url.endsWith('/auth/refresh')) {
        await new Promise((r) => setTimeout(r, 30));
        return ok({ accessToken: 'fresh' });
      }
      const auth = new Headers(init.headers).get('Authorization');
      if (auth === 'Bearer fresh') return ok({ url });
      seen.add(url);
      return status(401);
    });
    const { apiClient, tokenStorage } = await loadClient();
    tokenStorage.setAccessToken('expired');

    const results = await Promise.all([
      apiClient('/admin/a'),
      apiClient('/admin/b'),
      apiClient('/admin/c'),
      apiClient('/admin/d'),
    ]);

    expect(results).toHaveLength(4);
    expect(seen.size).toBe(4);
    expect(refreshCalls(calls)).toHaveLength(1);
  });

  it('ends the session when refresh fails: clears tokens and broadcasts session-expired', async () => {
    stubFetch((url) => (url.endsWith('/auth/refresh') ? status(401) : status(401)));
    const { apiClient, tokenStorage, SESSION_EXPIRED_EVENT, ApiError } = await loadClient();
    tokenStorage.setAccessToken('expired');
    const expired = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, expired);

    await expect(apiClient('/admin/products')).rejects.toBeInstanceOf(ApiError);

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(expired).toHaveBeenCalledTimes(1);
    window.removeEventListener(SESSION_EXPIRED_EVENT, expired);
  });

  it('retries a failed refresh once, covering a rotation by another tab', async () => {
    let refreshAttempts = 0;
    const calls = stubFetch((url) => {
      if (url.endsWith('/auth/refresh')) {
        refreshAttempts += 1;
        return refreshAttempts === 1 ? status(401) : ok({ accessToken: 'fresh' });
      }
      return refreshAttempts === 0 ? status(401) : ok({ done: true });
    });
    const { apiClient } = await loadClient();

    const res = await apiClient<{ done: boolean }>('/admin/products');

    expect(res.data.done).toBe(true);
    expect(refreshCalls(calls)).toHaveLength(2);
  });

  it('does not try to refresh for unauthenticated calls', async () => {
    const calls = stubFetch(() => status(401));
    const { apiClient, ApiError } = await loadClient();

    await expect(apiClient('/auth/login', { requiresAuth: false, method: 'POST' })).rejects.toBeInstanceOf(ApiError);

    expect(refreshCalls(calls)).toHaveLength(0);
  });

  it('surfaces the server error message', async () => {
    stubFetch(() => new Response(JSON.stringify({ message: 'Bad thing' }), { status: 400 }));
    const { apiClient } = await loadClient();

    await expect(apiClient('/contact', { requiresAuth: false, method: 'POST' })).rejects.toMatchObject({
      status: 400,
      message: 'Bad thing',
    });
  });
});
