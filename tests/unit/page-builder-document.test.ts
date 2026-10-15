import { describe, expect, it } from 'vitest';
import {
  addListItem, createSection, defaultContent, duplicateSection, emptyDocument, getIn, insertSection, localized, moveListItem,
  moveSection, removeListItem, removeSection, setContent, setHidden, setIn, setMeta, setSeo, setStyle, updateSection,
} from '@/lib/page-builder/document';
import { canRedo, canUndo, commit, createHistory, redo, undo, GROUP_WINDOW_MS } from '@/lib/page-builder/history';
import type { FieldDef, PageDocument, SectionDefinition } from '@/lib/page-builder/types';

const ctaFields: FieldDef[] = [
  { name: 'label', kind: 'TEXT', label: 'Label', localized: true },
  { name: 'url', kind: 'URL', label: 'Link' },
  { name: 'variant', kind: 'ENUM', label: 'Style', options: ['primary', 'secondary'], defaultValue: 'primary' },
];
const hero: SectionDefinition = {
  type: 'hero', label: 'Hero', description: '', category: 'Banners',
  fields: [
    { name: 'heading', kind: 'TEXT', label: 'Heading', localized: true },
    { name: 'overlay', kind: 'NUMBER', label: 'Overlay', defaultValue: 40 },
    { name: 'ctas', kind: 'LIST', label: 'Buttons', maxItems: 2, itemFields: ctaFields },
  ],
};
const spacer: SectionDefinition = { type: 'spacer', label: 'Spacer', description: '', category: 'Layout', fields: [] };

const withSections = (): PageDocument => {
  let doc = emptyDocument('Page');
  doc = insertSection(doc, createSection(hero, 'a'), 0);
  doc = insertSection(doc, createSection(spacer, 'b'), 1);
  doc = insertSection(doc, createSection(spacer, 'c'), 2);
  return doc;
};
const ids = (doc: PageDocument) => doc.sections.map((s) => s.id);

describe('section operations', () => {
  it('creates sections with registry defaults and a default style', () => {
    const s = createSection(hero, 'x');
    expect(s).toMatchObject({ id: 'x', type: 'hero', hidden: false, content: { overlay: 40, ctas: [] }, style: { background: 'white', width: 'normal' } });
    // With the server's style catalogue, only the applicable fields get defaults, plus the type's own overrides.
    const styleFields = [
      { name: 'background', kind: 'ENUM' as const, label: 'Background', defaultValue: 'white' },
      { name: 'buttonShape', kind: 'ENUM' as const, label: 'Shape', defaultValue: 'pill' },
      { name: 'width', kind: 'ENUM' as const, label: 'Width', defaultValue: 'normal' },
    ];
    const cta = { ...hero, type: 'cta', styleFieldNames: ['background', 'buttonShape'], styleDefaults: { background: 'brand' } };
    expect(createSection(cta, 'c', styleFields).style).toEqual({ background: 'brand', buttonShape: 'pill' });
    expect(createSection(hero, 'h', styleFields).style).toEqual({ background: 'white', buttonShape: 'pill', width: 'normal' });
    expect(defaultContent(ctaFields)).toEqual({ variant: 'primary' });
  });

  it('inserts at an index, clamping out-of-range positions', () => {
    const doc = withSections();
    expect(ids(insertSection(doc, createSection(spacer, 'n'), 1))).toEqual(['a', 'n', 'b', 'c']);
    expect(ids(insertSection(doc, createSection(spacer, 'n'), 99))).toEqual(['a', 'b', 'c', 'n']);
    expect(ids(insertSection(doc, createSection(spacer, 'n'), -5))).toEqual(['n', 'a', 'b', 'c']);
  });

  it('reorders without mutating the original', () => {
    const doc = withSections();
    expect(ids(moveSection(doc, 2, 0))).toEqual(['c', 'a', 'b']);
    expect(ids(moveSection(doc, 0, 2))).toEqual(['b', 'c', 'a']);
    expect(ids(doc)).toEqual(['a', 'b', 'c']);
    expect(moveSection(doc, 1, 1)).toBe(doc);
    expect(moveSection(doc, 9, 0)).toBe(doc);
  });

  it('removes and duplicates (copy gets a new id and is independent)', () => {
    const doc = withSections();
    expect(ids(removeSection(doc, 'b'))).toEqual(['a', 'c']);
    const dup = duplicateSection(setContent(doc, 'a', ['heading', 'en'], 'Hello'), 'a', 'a2');
    expect(ids(dup)).toEqual(['a', 'a2', 'b', 'c']);
    const edited = setContent(dup, 'a2', ['heading', 'en'], 'Changed');
    expect(getIn(edited.sections[0].content, ['heading', 'en'])).toBe('Hello');
    expect(getIn(edited.sections[1].content, ['heading', 'en'])).toBe('Changed');
    expect(duplicateSection(doc, 'missing')).toBe(doc);
  });

  it('toggles visibility and style', () => {
    const doc = withSections();
    expect(setHidden(doc, 'a', true).sections[0].hidden).toBe(true);
    expect(setStyle(doc, 'a', 'background', 'dark').sections[0].style.background).toBe('dark');
    expect(updateSection(doc, 'missing', (s) => s)).toBe(doc);
  });
});

describe('content paths', () => {
  it('sets nested localized values immutably and removes emptied keys', () => {
    const doc = withSections();
    const next = setContent(doc, 'a', ['heading', 'fr'], 'Bonjour');
    expect(getIn(next.sections[0].content, ['heading', 'fr'])).toBe('Bonjour');
    expect(doc.sections[0].content.heading).toBeUndefined();
    const cleared = setContent(next, 'a', ['heading', 'fr'], '');
    expect((cleared.sections[0].content.heading as Record<string, string>).fr).toBeUndefined();
  });

  it('setIn works on arrays', () => {
    expect(setIn({ items: [{ a: 1 }, { a: 2 }] }, ['items', 1, 'a'], 9)).toEqual({ items: [{ a: 1 }, { a: 9 }] });
    expect(setIn(undefined, ['a', 'b'], 1)).toEqual({ a: { b: 1 } });
  });

  it('adds, moves and removes list items within the maximum', () => {
    let doc = withSections();
    const ctas = hero.fields[2];
    doc = addListItem(doc, 'a', ['ctas'], ctas);
    doc = addListItem(doc, 'a', ['ctas'], ctas);
    expect(getIn(doc.sections[0].content, ['ctas'])).toHaveLength(2);
    expect(addListItem(doc, 'a', ['ctas'], ctas)).toBe(doc);
    doc = setContent(doc, 'a', ['ctas', 0, 'url'], '/first');
    doc = setContent(doc, 'a', ['ctas', 1, 'url'], '/second');
    doc = moveListItem(doc, 'a', ['ctas'], 1, 0);
    expect(getIn(doc.sections[0].content, ['ctas', 0, 'url'])).toBe('/second');
    doc = removeListItem(doc, 'a', ['ctas'], 0);
    expect(getIn(doc.sections[0].content, ['ctas'])).toEqual([{ variant: 'primary', url: '/first' }]);
  });
});

describe('page settings', () => {
  it('sets and clears meta and seo fields', () => {
    let doc = setMeta(emptyDocument('Home'), 'fr', 'title', 'Accueil');
    expect(doc.meta.fr?.title).toBe('Accueil');
    doc = setMeta(doc, 'fr', 'title', '');
    expect(doc.meta.fr?.title).toBeUndefined();
    doc = setSeo(doc, 'canonicalUrl', 'https://example.com/a');
    expect(doc.seo.canonicalUrl).toBe('https://example.com/a');
    expect(setSeo(doc, 'canonicalUrl', '').seo.canonicalUrl).toBeUndefined();
    expect(setSeo(doc, 'noIndex', true).seo.noIndex).toBe(true);
  });

  it('localized() falls back to English', () => {
    expect(localized({ en: 'Hello', fr: 'Bonjour' }, 'fr')).toBe('Bonjour');
    expect(localized({ en: 'Hello' }, 'zh')).toBe('Hello');
    expect(localized({ en: 'Hello', zh: '  ' }, 'zh')).toBe('Hello');
    expect(localized(undefined, 'en')).toBe('');
  });
});

describe('undo / redo history', () => {
  it('undoes and redoes whole steps', () => {
    let h = createHistory(emptyDocument('v0'));
    const v1 = setMeta(h.present, 'en', 'title', 'v1');
    const v2 = setMeta(v1, 'en', 'title', 'v2');
    h = commit(commit(h, v1, undefined, 0), v2, undefined, 10);
    expect(canUndo(h)).toBe(true);
    h = undo(h);
    expect(h.present.meta.en?.title).toBe('v1');
    h = undo(h);
    expect(h.present.meta.en?.title).toBe('v0');
    expect(canUndo(h)).toBe(false);
    expect(undo(h)).toBe(h);
    h = redo(redo(h));
    expect(h.present.meta.en?.title).toBe('v2');
    expect(canRedo(h)).toBe(false);
  });

  it('a new edit after undo drops the redo branch', () => {
    let h = createHistory(emptyDocument('v0'));
    h = commit(h, setMeta(h.present, 'en', 'title', 'v1'), undefined, 0);
    h = undo(h);
    h = commit(h, setMeta(h.present, 'en', 'title', 'other'), undefined, 5000);
    expect(canRedo(h)).toBe(false);
  });

  it('collapses rapid edits to one field into one undo step', () => {
    let h = createHistory(emptyDocument('v0'));
    let doc = h.present;
    for (let i = 1; i <= 5; i++) {
      doc = setMeta(doc, 'en', 'title', 'typing ' + i);
      h = commit(h, doc, 'meta.title', i * 100);
    }
    expect(h.past).toHaveLength(1);
    expect(undo(h).present.meta.en?.title).toBe('v0');
    // After a pause, or in another field, a new step starts.
    h = commit(h, setMeta(h.present, 'en', 'title', 'later'), 'meta.title', 5 * 100 + GROUP_WINDOW_MS + 1);
    expect(h.past).toHaveLength(2);
    h = commit(h, setMeta(h.present, 'en', 'seoTitle', 'x'), 'meta.seoTitle', 5 * 100 + GROUP_WINDOW_MS + 2);
    expect(h.past).toHaveLength(3);
  });

  it('ignores commits that change nothing', () => {
    const h = createHistory(emptyDocument('v0'));
    expect(commit(h, h.present)).toBe(h);
  });
});
