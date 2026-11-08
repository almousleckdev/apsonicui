// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createResetPasswordSchema } from '@/lib/schemas/auth';

const ok = () => new Response(JSON.stringify({ success: true, data: null }), { status: 200 });

describe('reset password schema', () => {
  const schema = createResetPasswordSchema((key) => key);
  const parse = (password: string, confirm = password) => schema.safeParse({ password, confirmPassword: confirm });

  it('accepts a password that meets every rule', () => {
    expect(parse('New-Strong#Pass1').success).toBe(true);
  });

  it.each([
    ['too short', 'Ab1!'],
    ['no uppercase letter', 'new-strong#pass1'],
    ['no lowercase letter', 'NEW-STRONG#PASS1'],
    ['no digit', 'New-Strong#Pass'],
    ['no special character', 'NewStrongPass12'],
    ['contains a space', 'New Strong#Pass1'],
  ])('rejects a password with %s', (_label, password) => {
    expect(parse(password).success).toBe(false);
  });

  it('rejects a confirmation that does not match', () => {
    const result = parse('New-Strong#Pass1', 'New-Strong#Pass2');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['confirmPassword']);
  });
});

describe('password reset requests', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function load() {
    vi.resetModules();
    const fetchMock = vi.fn(async () => ok());
    vi.stubGlobal('fetch', fetchMock);
    const { authService, userService } = await import('@/services/auth-service');
    return { authService, userService, fetchMock };
  }

  it('asks the server to email a reset link, without a login', async () => {
    const { authService, fetchMock } = await load();

    await authService.forgotPassword('a@b.com');

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/v1/auth/forgot-password');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ email: 'a@b.com' });
    expect(new Headers(init.headers).get('Authorization')).toBeNull();
  });

  it('sends the link token and the new password together', async () => {
    const { authService, fetchMock } = await load();

    await authService.resetPassword('tok-123', 'New-Strong#Pass1');

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/v1/auth/reset-password');
    expect(JSON.parse(init.body as string)).toEqual({ token: 'tok-123', password: 'New-Strong#Pass1' });
  });

  it('resends an invitation for a user', async () => {
    const { userService, fetchMock } = await load();

    await userService.resendInvitation(42);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/v1/admin/users/42/invitation');
    expect(init.method).toBe('POST');
  });
});
