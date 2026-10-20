import { describe, expect, it } from 'vitest';
import { isValidSlug, slugify, SLUG_MAX_LENGTH } from '@/lib/page-builder/slug';
import { buildTemplateDocument, PAGE_TEMPLATES } from '@/lib/page-builder/templates';
import type { SectionDefinition } from '@/lib/page-builder/types';

describe('slugify', () => {
  it('makes readable addresses from titles', () => {
    expect(slugify('About Us')).toBe('about-us');
    expect(slugify('  Our   History!  ')).toBe('our-history');
    expect(slugify('News & Events')).toBe('news-and-events');
    expect(slugify('Innovation & Technology 2026')).toBe('innovation-and-technology-2026');
  });

  it('removes accents and drops characters it cannot express', () => {
    expect(slugify('À propos de nous')).toBe('a-propos-de-nous');
    expect(slugify('关于我们')).toBe('');
    expect(slugify('Café / Bar')).toBe('cafe-bar');
  });

  it('never ends or starts with a hyphen and respects the length limit', () => {
    const long = slugify('word '.repeat(60));
    expect(long.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH);
    expect(long.endsWith('-')).toBe(false);
    expect(slugify('---x---')).toBe('x');
  });

  it('produces addresses the validator accepts', () => {
    for (const title of ['About Us', 'Careers', 'Innovation & Technology', 'Dealers 2026']) {
      expect(isValidSlug(slugify(title))).toBe(true);
    }
  });
});

describe('isValidSlug', () => {
  it('matches the backend shape', () => {
    expect(isValidSlug('about-us')).toBe(true);
    for (const bad of ['', 'About', 'a_b', '-a', 'a-', 'a--b', 'a/b', 'a b', 'x'.repeat(SLUG_MAX_LENGTH + 1)]) {
      expect(isValidSlug(bad)).toBe(false);
    }
  });
});

describe('page templates', () => {
  const defs = new Map<string, SectionDefinition>(
    ['hero', 'rich-text', 'text-image', 'stats', 'cta-banner', 'feature-grid', 'product-showcase', 'contact', 'dealers', 'faq'].map((type) => [
      type, { type, label: type, description: '', category: 'x', fields: [] },
    ]),
  );

  it('offers a blank page first', () => {
    expect(PAGE_TEMPLATES[0].id).toBe('blank');
    expect(buildTemplateDocument(PAGE_TEMPLATES[0], 'Empty', defs).sections).toEqual([]);
  });

  it('builds every template with the title and unique section ids', () => {
    for (const template of PAGE_TEMPLATES) {
      const doc = buildTemplateDocument(template, 'My page', defs);
      expect(doc.meta.en?.title).toBe('My page');
      expect(doc.sections.map((s) => s.type)).toEqual(template.sections);
      expect(new Set(doc.sections.map((s) => s.id)).size).toBe(doc.sections.length);
    }
  });

  it('skips section types the server does not offer instead of failing', () => {
    const partial = new Map([...defs].filter(([type]) => type !== 'stats'));
    const about = PAGE_TEMPLATES.find((t) => t.id === 'about')!;
    expect(buildTemplateDocument(about, 'About', partial).sections.map((s) => s.type)).toEqual(['hero', 'text-image', 'cta-banner']);
  });
});
