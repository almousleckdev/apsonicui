import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { NextIntlClientProvider } from 'next-intl';
import { VideoHero } from '@/components/shared/video-hero';

/**
 * The first screen is the hero: its picture, tagline, headline and subtitle. They must be visible in the server HTML,
 * not hidden until the scripts run, which on a slow connection can take tens of seconds.
 */
describe('home hero on the server', () => {
  // children are passed as createElement arguments, so the provider is typed without the required children prop
  const Provider = NextIntlClientProvider as unknown as React.ComponentType<{ locale: string; messages: object }>;
  const html = renderToString(
    React.createElement(Provider, { locale: 'en', messages: {} }, React.createElement(VideoHero)),
  );

  it('contains the headline text', () => {
    expect(html).toContain('Good Quality, Good Life');
  });

  it('does not start hidden', () => {
    expect(html).not.toMatch(/opacity:\s*0(?![.\d])/);
  });
});
