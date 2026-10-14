// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const user = { id: 1, username: 'a', email: 'a@x.test' } as never;

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.resetModules();
  });

  it('keeps the access token and profile in memory only', async () => {
    const { tokenStorage } = await import('@/services/token-storage');

    tokenStorage.setAccessToken('secret-token');
    tokenStorage.setUser(user);

    expect(tokenStorage.getAccessToken()).toBe('secret-token');
    expect(tokenStorage.getUser()).toBe(user);
    // Nothing a script (or XSS payload) could read back from persistent storage.
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    expect(document.cookie).toBe('');
  });

  it('purges credentials persisted by earlier versions', async () => {
    localStorage.setItem('apsonic_access_token', 'old-long-lived-token');
    localStorage.setItem('apsonic_user_profile', '{"id":1}');
    localStorage.setItem('unrelated', 'keep');

    await import('@/services/token-storage');

    expect(localStorage.getItem('apsonic_access_token')).toBeNull();
    expect(localStorage.getItem('apsonic_user_profile')).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });

  it('clearAll forgets everything', async () => {
    const { tokenStorage } = await import('@/services/token-storage');
    tokenStorage.setAccessToken('t');
    tokenStorage.setUser(user);

    tokenStorage.clearAll();

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getUser()).toBeNull();
  });
});
