import { describe, expect, it } from 'vitest';
import { copySources, isBlankText } from '@/lib/i18n/translation-copy';
import { fillEmptyTranslations } from '@/lib/page-builder/translate';
import type { FieldDef } from '@/lib/page-builder/types';

const field = (name: string, extra: Partial<FieldDef> = {}): FieldDef => ({ name, kind: 'TEXT', label: name, localized: true, ...extra } as FieldDef);

describe('isBlankText', () => {
  it('treats empty html as blank but keeps media-only html', () => {
    expect(isBlankText(undefined)).toBe(true);
    expect(isBlankText('   ')).toBe(true);
    expect(isBlankText('<p></p>')).toBe(true);
    expect(isBlankText('<p>&nbsp;</p>')).toBe(true);
    expect(isBlankText('<p>Hi</p>')).toBe(false);
    expect(isBlankText('<p><img src="/a.png"></p>')).toBe(false);
  });
});

describe('copySources', () => {
  it('offers every other language that has text, never the current one or an identical copy', () => {
    expect(copySources('fr', { en: 'Hello', fr: '', zh: '你好' }).map((s) => s.lang)).toEqual(['en', 'zh']);
    expect(copySources('en', { en: 'Hello', fr: 'Hello', zh: '' })).toEqual([]);
    expect(copySources('zh', { en: '<p></p>' })).toEqual([]);
  });
});

describe('fillEmptyTranslations', () => {
  const fields = [
    field('heading'),
    field('subheading'),
    field('align', { localized: false }),
    field('ctas', { kind: 'LIST', localized: false, itemFields: [field('label'), field('url', { localized: false })] }),
  ];
  const content = {
    heading: { en: 'Ride with us' },
    subheading: { en: 'Quality', fr: 'Qualité' },
    align: 'left',
    ctas: [{ label: { en: 'Contact' }, url: '/contact' }, { label: { en: 'Buy', fr: 'Acheter' }, url: '/buy' }],
  };

  it('copies English into empty French texts, including inside lists, and nothing else', () => {
    const { content: out, count } = fillEmptyTranslations(content, fields, 'en', 'fr');
    expect(count).toBe(2);
    expect(out.heading).toEqual({ en: 'Ride with us', fr: 'Ride with us' });
    expect(out.subheading).toEqual({ en: 'Quality', fr: 'Qualité' });
    expect((out.ctas as Array<Record<string, unknown>>)[0].label).toEqual({ en: 'Contact', fr: 'Contact' });
    expect((out.ctas as Array<Record<string, unknown>>)[1].label).toEqual({ en: 'Buy', fr: 'Acheter' });
    expect(out.align).toBe('left');
  });

  it('never replaces what is already written, does not mutate, and reports nothing to do', () => {
    const before = JSON.stringify(content);
    fillEmptyTranslations(content, fields, 'en', 'fr');
    expect(JSON.stringify(content)).toBe(before);
    const second = fillEmptyTranslations(fillEmptyTranslations(content, fields, 'en', 'fr').content, fields, 'en', 'fr');
    expect(second.count).toBe(0);
    expect(fillEmptyTranslations(content, fields, 'en', 'en').count).toBe(0);
  });
});
