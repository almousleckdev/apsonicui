import { describe, expect, it } from 'vitest';
import registry from '../fixtures/section-registry.json';
import { BUILDER_GLOSSARY } from '@/lib/i18n/admin/glossary/builder';

interface Field { label: string; help?: string; group?: string; options?: string[]; optionLabels?: string[]; itemFields?: Field[] }

/** Every English text the server sends that an editor reads. */
function serverTexts(): string[] {
  const out = new Set<string>();
  const walk = (fields: Field[]) => {
    for (const f of fields) {
      out.add(f.label);
      if (f.help) out.add(f.help);
      if (f.group) out.add(f.group);
      for (const option of f.optionLabels ?? f.options ?? []) out.add(option);
      if (f.itemFields) walk(f.itemFields);
    }
  };
  walk(registry.style as Field[]);
  for (const s of registry.sections as Array<{ label: string; description: string; category: string; fields: Field[] }>) {
    out.add(s.label); out.add(s.description); out.add(s.category);
    walk(s.fields);
  }
  return [...out].filter((text) => !/^\d+$/.test(text));
}

describe('page builder glossary', () => {
  // tests/fixtures/section-registry.json is a snapshot of the server's catalogue (SectionRegistry); refresh it when
  // fields change on the server, then add the Chinese for whatever this test lists.
  it('has Chinese for every text the server sends with the section catalogue', () => {
    expect(serverTexts().filter((text) => !BUILDER_GLOSSARY[text])).toEqual([]);
  });

  it('contains no entry that is empty', () => {
    expect(Object.entries(BUILDER_GLOSSARY).filter(([, zh]) => !zh.trim())).toEqual([]);
  });
});

describe('page builder palette', () => {
  it('has a Chinese name for every color of the palette', async () => {
    const { PALETTE } = await import('@/lib/page-builder/colors');
    expect(PALETTE.map((c) => c.name).filter((name) => !BUILDER_GLOSSARY[name])).toEqual([]);
  });
});
