import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

/**
 * The page must be readable before any script runs. On a slow connection the scripts arrive many seconds late, and a
 * section that starts hidden in the server HTML stays blank until then.
 */
describe('ScrollReveal on the server', () => {
  const variants = ['fadeUp', 'fadeIn', 'scaleIn', 'slideLeft', 'slideRight'] as const;

  it.each(variants)('renders %s content visible in the server HTML', (variant) => {
    const html = renderToString(
      React.createElement(ScrollReveal, { variant }, React.createElement('p', null, 'Visible without scripts')),
    );

    expect(html).toContain('Visible without scripts');
    expect(html).not.toMatch(/opacity:\s*0(?![.\d])/);
  });
});
