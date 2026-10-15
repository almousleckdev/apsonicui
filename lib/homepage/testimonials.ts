import type { HomeTestimonialItem } from '@/lib/types/homepage';

export type TestimonialLocale = 'en' | 'fr' | 'zh';

export const TESTIMONIAL_LIMITS = {
  maxItems: 12,
  name: 80,
  role: 90,
  quote: 420,
} as const;

export interface ResolvedTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  /** Site-relative image path, or '' when the testimonial has no usable photo. */
  image: string;
}

const clean = (value?: string) => (value ?? '').trim();

/** Only site-relative paths are rendered as photos: an arbitrary external host would make next/image throw. */
export function isSafeImagePath(src?: string): boolean {
  const value = clean(src);
  return value.startsWith('/') && !value.startsWith('//') && !value.includes('..') && !/[<>"]/.test(value);
}

/** Text for the visitor's language, falling back to English and then to any other language that has text. */
function pick(item: HomeTestimonialItem, field: 'role' | 'quote', locale: string): string {
  const byLocale: Record<TestimonialLocale, string> = {
    en: clean(item[`${field}En`]),
    fr: clean(item[`${field}Fr`]),
    zh: clean(item[`${field}Zh`]),
  };
  const wanted = (['en', 'fr', 'zh'] as const).includes(locale as TestimonialLocale) ? (locale as TestimonialLocale) : 'en';
  return byLocale[wanted] || byLocale.en || byLocale.fr || byLocale.zh;
}

/**
 * What the public card shows for one visitor language. Returns null for an entry that cannot be shown
 * (no name or no quote in any language), so half-filled rows never appear on the site.
 */
export function resolveTestimonial(item: HomeTestimonialItem, locale: string): ResolvedTestimonial | null {
  const name = clean(item.name);
  const quote = pick(item, 'quote', locale);
  if (!name || !quote) return null;
  return {
    id: item.id,
    name,
    role: pick(item, 'role', locale),
    quote,
    image: isSafeImagePath(item.image) ? clean(item.image) : '',
  };
}

export function resolveTestimonials(items: HomeTestimonialItem[] | undefined, locale: string): ResolvedTestimonial[] {
  return (items ?? []).map((item) => resolveTestimonial(item, locale)).filter((t): t is ResolvedTestimonial => t !== null);
}

export interface TestimonialErrors {
  name?: string;
  image?: string;
  quoteEn?: string;
  roleEn?: string;
  roleFr?: string;
  roleZh?: string;
  quoteFr?: string;
  quoteZh?: string;
}

/** Field-level problems per testimonial id. An empty object means the list can be saved. */
export function validateTestimonials(items: HomeTestimonialItem[]): Record<string, TestimonialErrors> {
  const result: Record<string, TestimonialErrors> = {};
  for (const item of items) {
    const errors: TestimonialErrors = {};
    const name = clean(item.name);
    if (!name) errors.name = 'Name is required.';
    else if (name.length > TESTIMONIAL_LIMITS.name) errors.name = `Keep the name under ${TESTIMONIAL_LIMITS.name} characters.`;

    if (clean(item.image) && !isSafeImagePath(item.image)) errors.image = 'Upload the photo again (only uploaded images are allowed).';

    if (!clean(item.quoteEn)) errors.quoteEn = 'The English quote is required; it is shown when a translation is missing.';
    for (const [field, label] of [['quoteEn', 'English'], ['quoteFr', 'French'], ['quoteZh', 'Chinese']] as const) {
      if (clean(item[field]).length > TESTIMONIAL_LIMITS.quote) errors[field] = `The ${label} quote is over ${TESTIMONIAL_LIMITS.quote} characters.`;
    }
    for (const [field, label] of [['roleEn', 'English'], ['roleFr', 'French'], ['roleZh', 'Chinese']] as const) {
      if (clean(item[field]).length > TESTIMONIAL_LIMITS.role) errors[field] = `The ${label} role is over ${TESTIMONIAL_LIMITS.role} characters.`;
    }
    if (Object.keys(errors).length > 0) result[item.id] = errors;
  }
  return result;
}

export function createEmptyTestimonial(): HomeTestimonialItem {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
  return { id, name: '', image: '', roleEn: '', roleFr: '', roleZh: '', quoteEn: '', quoteFr: '', quoteZh: '' };
}

/*
 * List edits as pure functions of the CURRENT list, addressed by id. The editor applies them with functional state
 * updates, so a slow action (a photo upload finishing a second later) is applied to the latest list instead of
 * overwriting edits made in the meantime, and still hits the right row if the list was reordered meanwhile.
 */
export function patchTestimonial(items: HomeTestimonialItem[], id: string, patch: Partial<HomeTestimonialItem>): HomeTestimonialItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function moveTestimonial(items: HomeTestimonialItem[], id: string, direction: -1 | 1): HomeTestimonialItem[] {
  const from = items.findIndex((item) => item.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= items.length) return items;
  const next = [...items];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

export function removeTestimonial(items: HomeTestimonialItem[], id: string): HomeTestimonialItem[] {
  return items.filter((item) => item.id !== id);
}

export function addTestimonial(items: HomeTestimonialItem[]): HomeTestimonialItem[] {
  return items.length >= TESTIMONIAL_LIMITS.maxItems ? items : [...items, createEmptyTestimonial()];
}
