import { describe, expect, it } from 'vitest';
import { buildContentSecurityPolicy, generateNonce } from '@/lib/security/csp';

const directive = (csp: string, name: string) =>
  csp.split('; ').find((d) => d.startsWith(`${name} `)) ?? '';

describe('Content-Security-Policy', () => {
  it('production: scripts only via nonce, no eval, no inline-script escape hatches', () => {
    const csp = buildContentSecurityPolicy('abc123', false);
    const scripts = directive(csp, 'script-src');

    expect(scripts).toContain("'nonce-abc123'");
    expect(scripts).toContain("'strict-dynamic'");
    expect(scripts).not.toContain("'unsafe-eval'");
    expect(scripts).not.toContain("'unsafe-inline'");
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('forbids plugins, framing, base-tag and cross-site form hijacking', () => {
    const csp = buildContentSecurityPolicy('n', false);

    expect(directive(csp, 'object-src')).toBe("object-src 'none'");
    expect(directive(csp, 'frame-ancestors')).toBe("frame-ancestors 'none'");
    expect(directive(csp, 'base-uri')).toBe("base-uri 'self'");
    expect(directive(csp, 'form-action')).toBe("form-action 'self'");
    expect(directive(csp, 'default-src')).toBe("default-src 'self'");
  });

  it('lets only the page-builder preview be framed, and only by the same origin', () => {
    const preview = buildContentSecurityPolicy('n', false, { allowSelfFraming: true });
    expect(directive(preview, 'frame-ancestors')).toBe("frame-ancestors 'self'");
    expect(directive(buildContentSecurityPolicy('n', false), 'frame-ancestors')).toBe("frame-ancestors 'none'");
  });

  it('lets only admin pages frame this origin (the page builder canvas)', () => {
    expect(directive(buildContentSecurityPolicy('n', false, { frameSelf: true }), 'frame-src')).toContain("'self'");
    expect(directive(buildContentSecurityPolicy('n', false), 'frame-src')).not.toContain("'self'");
  });

  it('only embeds the third-party frames the site uses', () => {
    const frames = directive(buildContentSecurityPolicy('n', false), 'frame-src');

    expect(frames).toContain('https://www.youtube.com');
    expect(frames).toContain('https://maps.google.com');
    expect(frames).not.toContain('*');
    expect(frames).not.toContain("'self'");
  });

  it('development adds eval and websockets for hot reload, and nothing else weakens the policy', () => {
    const dev = buildContentSecurityPolicy('n', true);

    expect(directive(dev, 'script-src')).toContain("'unsafe-eval'");
    expect(directive(dev, 'connect-src')).toContain('ws://localhost:*');
    expect(dev).not.toContain('upgrade-insecure-requests');
    expect(directive(dev, 'object-src')).toBe("object-src 'none'");
  });

  it('nonces are unique per request and not guessable-length', () => {
    const nonces = new Set(Array.from({ length: 50 }, () => generateNonce()));

    expect(nonces.size).toBe(50);
    expect([...nonces][0].length).toBeGreaterThanOrEqual(24);
  });
});
