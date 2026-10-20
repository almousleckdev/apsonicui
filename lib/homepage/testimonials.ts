import type { AdminProblem } from '@/lib/i18n/admin/problem';
import { isSafeImagePath } from '@/lib/media/safe-path';
import type { HomeTestimonialItem } from '@/lib/types/homepage';

export { isSafeImagePath };

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

export type TestimonialErrors = Partial<Record<'name' | 'image' | 'quoteEn' | 'quoteFr' | 'quoteZh' | 'roleEn' | 'roleFr' | 'roleZh', AdminProblem>>;

/** Field-level problems per testimonial id. An empty object means the list can be saved. */
export function validateTestimonials(items: HomeTestimonialItem[]): Record<string, TestimonialErrors> {
  const result: Record<string, TestimonialErrors> = {};
  for (const item of items) {
    const errors: TestimonialErrors = {};
    const name = clean(item.name);
    if (!name) errors.name = { key: 'home.problems.nameRequired' };
    else if (name.length > TESTIMONIAL_LIMITS.name) errors.name = { key: 'home.problems.nameTooLong', values: { max: TESTIMONIAL_LIMITS.name } };

    if (clean(item.image) && !isSafeImagePath(item.image)) errors.image = { key: 'home.problems.photoNotUploaded' };

    if (!clean(item.quoteEn)) errors.quoteEn = { key: 'home.problems.quoteRequired' };
    for (const field of ['quoteEn', 'quoteFr', 'quoteZh'] as const) {
      if (clean(item[field]).length > TESTIMONIAL_LIMITS.quote) errors[field] = { key: 'home.problems.quoteTooLong', values: { max: TESTIMONIAL_LIMITS.quote } };
    }
    for (const field of ['roleEn', 'roleFr', 'roleZh'] as const) {
      if (clean(item[field]).length > TESTIMONIAL_LIMITS.role) errors[field] = { key: 'home.problems.roleTooLong', values: { max: TESTIMONIAL_LIMITS.role } };
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
