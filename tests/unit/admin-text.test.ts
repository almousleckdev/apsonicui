import { describe, expect, it } from 'vitest';
import { adminCatalog } from '@/lib/i18n/admin/catalog';
import { ADMIN_TEXT_MODES, DEFAULT_ADMIN_TEXT_MODE, normalizeAdminTextMode, splitCatalog, type CatalogNode, type Pair } from '@/lib/i18n/admin/text';
import { joinText } from '@/context/AdminTextContext';

function pairs(node: CatalogNode, path = ''): Array<[string, Pair]> {
  return Object.entries(node).flatMap(([key, value]) =>
    Array.isArray(value) ? [[`${path}${key}`, value as Pair] as [string, Pair]] : pairs(value as CatalogNode, `${path}${key}.`));
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort();

describe('admin catalog', () => {
  const all = pairs(adminCatalog);

  it('has an English and a Chinese version of every string', () => {
    for (const [key, [en, zh]] of all) {
      expect(en.trim(), `${key} (en)`).not.toBe('');
      expect(zh.trim(), `${key} (zh)`).not.toBe('');
    }
  });

  it('uses the same placeholders in both languages', () => {
    for (const [key, [en, zh]] of all) expect(placeholders(zh), key).toEqual(placeholders(en));
  });

  it('really is Chinese in the Chinese column (no copy-pasted English)', () => {
    const untranslated = all.filter(([, [en, zh]]) => en === zh && /[A-Za-z]{4,}/.test(zh)).map(([key]) => key);
    // Brand names and abbreviations legitimately match; anything else is a missing translation.
    expect(untranslated.filter((key) => !/\.(brand|en|zh)$/.test(key))).toEqual([]);
  });
});

describe('splitCatalog', () => {
  it('produces one message tree per language with the same shape', () => {
    const { en, zh } = splitCatalog({ a: { b: ['Hello', '你好'] }, c: ['Bye', '再见'] });
    expect(en).toEqual({ a: { b: 'Hello' }, c: 'Bye' });
    expect(zh).toEqual({ a: { b: '你好' }, c: '再见' });
  });
});

describe('display mode', () => {
  it('offers 中文 and English only, with 中文 as the default', () => {
    expect(ADMIN_TEXT_MODES).toEqual(['zh', 'en']);
    expect(DEFAULT_ADMIN_TEXT_MODE).toBe('zh');
  });

  it('keeps a saved choice, and reads anything else (including the old "both") as 中文', () => {
    expect(normalizeAdminTextMode('zh')).toBe('zh');
    expect(normalizeAdminTextMode('en')).toBe('en');
    expect(normalizeAdminTextMode('both')).toBe('zh');
    expect(normalizeAdminTextMode('fr')).toBe('zh');
    expect(normalizeAdminTextMode(undefined)).toBe('zh');
  });

  it('shows exactly one language, never the two joined', () => {
    const text = { en: 'Products', zh: '产品管理' };
    expect(joinText(text, 'en')).toBe('Products');
    expect(joinText(text, 'zh')).toBe('产品管理');
  });
});
