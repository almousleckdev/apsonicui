import type { FieldDef, Locale, PageDocument, PageMeta, PageSection, SectionDefinition, SectionStyle } from './types';

/**
 * Pure operations on a page document. Every function returns a new document and never mutates its input, which is
 * what makes undo/redo, autosave comparison and React rendering straightforward. The backend re-validates all of it.
 */

export const DEFAULT_STYLE: Required<SectionStyle> = {
  background: 'white',
  paddingTop: 'md',
  paddingBottom: 'md',
  width: 'normal',
};

export function newId(): string {
  return crypto.randomUUID();
}

export function emptyDocument(title = ''): PageDocument {
  return { schemaVersion: 1, meta: { en: { title } }, seo: { noIndex: false }, sections: [] };
}

/** Default value of one field (lists start empty; unset fields stay absent). */
function defaultFor(field: FieldDef): unknown {
  if (field.kind === 'LIST') return [];
  return field.defaultValue;
}

export function defaultContent(fields: FieldDef[]): Record<string, unknown> {
  const content: Record<string, unknown> = {};
  for (const field of fields) {
    const value = defaultFor(field);
    if (value !== undefined) content[field.name] = value;
  }
  return content;
}

/** A new section with the registry defaults, the same as the backend would create. */
export function createSection(definition: SectionDefinition, id: string = newId()): PageSection {
  return { id, type: definition.type, hidden: false, style: { ...DEFAULT_STYLE }, content: defaultContent(definition.fields) };
}

export function insertSection(doc: PageDocument, section: PageSection, index: number): PageDocument {
  const at = Math.max(0, Math.min(index, doc.sections.length));
  const sections = [...doc.sections];
  sections.splice(at, 0, section);
  return { ...doc, sections };
}

export function moveSection(doc: PageDocument, fromIndex: number, toIndex: number): PageDocument {
  if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= doc.sections.length) return doc;
  const to = Math.max(0, Math.min(toIndex, doc.sections.length - 1));
  const sections = [...doc.sections];
  const [moved] = sections.splice(fromIndex, 1);
  sections.splice(to, 0, moved);
  return { ...doc, sections };
}

export function removeSection(doc: PageDocument, id: string): PageDocument {
  return { ...doc, sections: doc.sections.filter((s) => s.id !== id) };
}

/** Copies a section (with a new id) right after the original. */
export function duplicateSection(doc: PageDocument, id: string, newSectionId: string = newId()): PageDocument {
  const index = doc.sections.findIndex((s) => s.id === id);
  if (index < 0) return doc;
  const copy: PageSection = { ...structuredClone(doc.sections[index]), id: newSectionId };
  return insertSection(doc, copy, index + 1);
}

export function updateSection(doc: PageDocument, id: string, change: (section: PageSection) => PageSection): PageDocument {
  let touched = false;
  const sections = doc.sections.map((s) => {
    if (s.id !== id) return s;
    touched = true;
    return change(s);
  });
  return touched ? { ...doc, sections } : doc;
}

export function setHidden(doc: PageDocument, id: string, hidden: boolean): PageDocument {
  return updateSection(doc, id, (s) => ({ ...s, hidden }));
}

export function setStyle(doc: PageDocument, id: string, key: keyof SectionStyle, value: string): PageDocument {
  return updateSection(doc, id, (s) => ({ ...s, style: { ...s.style, [key]: value } }));
}

/** Immutable deep set along a path of object keys / array indexes; empty strings remove the key. */
export function setIn<T>(target: T, path: Array<string | number>, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const container: Record<string | number, unknown> | unknown[] = Array.isArray(target)
    ? [...target]
    : { ...((target as Record<string, unknown>) ?? {}) };
  const current = (container as Record<string | number, unknown>)[head];
  const next = setIn(current, rest, value);
  if (rest.length === 0 && (next === '' || next === undefined) && !Array.isArray(container)) {
    delete (container as Record<string, unknown>)[head as string];
  } else {
    (container as Record<string | number, unknown>)[head] = next;
  }
  return container as T;
}

export function setContent(doc: PageDocument, id: string, path: Array<string | number>, value: unknown): PageDocument {
  return updateSection(doc, id, (s) => ({ ...s, content: setIn(s.content, path, value) }));
}

export function getIn(target: unknown, path: Array<string | number>): unknown {
  let current: unknown = target;
  for (const key of path) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string | number, unknown>)[key];
  }
  return current;
}

/** Adds an item to a list field (using the item schema defaults); returns the document unchanged at the maximum. */
export function addListItem(doc: PageDocument, id: string, listPath: Array<string | number>, field: FieldDef): PageDocument {
  const section = doc.sections.find((s) => s.id === id);
  if (!section) return doc;
  const list = (getIn(section.content, listPath) as unknown[] | undefined) ?? [];
  if (field.maxItems !== undefined && list.length >= field.maxItems) return doc;
  return setContent(doc, id, listPath, [...list, defaultContent(field.itemFields ?? [])]);
}

export function removeListItem(doc: PageDocument, id: string, listPath: Array<string | number>, index: number): PageDocument {
  const section = doc.sections.find((s) => s.id === id);
  if (!section) return doc;
  const list = (getIn(section.content, listPath) as unknown[] | undefined) ?? [];
  return setContent(doc, id, listPath, list.filter((_, i) => i !== index));
}

export function moveListItem(doc: PageDocument, id: string, listPath: Array<string | number>, from: number, to: number): PageDocument {
  const section = doc.sections.find((s) => s.id === id);
  if (!section) return doc;
  const list = [...((getIn(section.content, listPath) as unknown[] | undefined) ?? [])];
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) return doc;
  const [moved] = list.splice(from, 1);
  list.splice(to, 0, moved);
  return setContent(doc, id, listPath, list);
}

export function setMeta(doc: PageDocument, locale: Locale, key: keyof PageMeta, value: string): PageDocument {
  const current = doc.meta[locale] ?? {};
  const next: PageMeta = { ...current };
  if (value === '') delete next[key];
  else next[key] = value;
  return { ...doc, meta: { ...doc.meta, [locale]: next } };
}

export function setSeo<K extends keyof PageDocument['seo']>(doc: PageDocument, key: K, value: PageDocument['seo'][K]): PageDocument {
  const seo = { ...doc.seo };
  if (value === '' || value === undefined) delete seo[key];
  else seo[key] = value;
  return { ...doc, seo };
}

export function documentsEqual(a: PageDocument, b: PageDocument): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Text of a localized value in the given language, falling back to English. */
export function localized(value: unknown, locale: Locale): string {
  if (!value || typeof value !== 'object') return typeof value === 'string' ? value : '';
  const map = value as Record<string, string | undefined>;
  return map[locale]?.trim() ? (map[locale] as string) : (map.en ?? '');
}

/** A short human label for a section in lists: its first piece of English text, or nothing. */
export function sectionSummary(section: PageSection): string {
  const preferred = ['heading', 'title', 'question', 'name', 'eyebrow', 'buttonLabel', 'caption', 'body'];
  for (const key of preferred) {
    const value = section.content[key];
    const text = typeof value === 'string' ? value : localized(value, 'en');
    const plain = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (plain) return plain.length > 48 ? plain.slice(0, 47) + '…' : plain;
  }
  return '';
}

/** Path used by the backend to point at a field, e.g. sections[2].content.ctas[0].url */
export function issuePath(sectionIndex: number, path: Array<string | number>): string {
  return path.reduce<string>((acc, key) => (typeof key === 'number' ? `${acc}[${key}]` : `${acc}.${key}`), `sections[${sectionIndex}].content`);
}
