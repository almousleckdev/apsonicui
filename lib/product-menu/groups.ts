import type { AdminProblem } from '@/lib/i18n/admin/problem';
import { isSafeImagePath } from '@/lib/media/safe-path';

export type MenuLocale = 'en' | 'fr' | 'zh';

/** A top-level entry of the Products menu ("Two-wheeler", ...). Categories point at it through their `parentType`. */
export interface ProductMenuGroup {
  /** Stable identifier stored in each category's `parentType`; never changes after creation. */
  id: string;
  labelEn: string;
  labelFr: string;
  labelZh: string;
  /** Picture of the group, a site-relative path such as /uploads/x.png. Required when a group is created or edited. */
  image: string;
}

export const PRODUCT_MENU_LIMITS = { maxGroups: 8, label: 40 } as const;

export const DEFAULT_PRODUCT_MENU_GROUPS: ProductMenuGroup[] = [
  { id: 'two-wheeler', labelEn: 'Two-wheeler', labelFr: 'Deux-roues', labelZh: '两轮车', image: '/categories/街车/AP125-27 (2.2).png' },
  { id: 'three-wheeler', labelEn: 'Three-wheeler', labelFr: 'Trois-roues', labelZh: '三轮车', image: '/categories/三轮车/AP150ZH-175 更新/AP150ZH-175 MAX (1).png' },
  { id: 'atv', labelEn: 'All-Terrain (ATV)', labelFr: 'Tout-terrain (ATV)', labelZh: '全地形', image: '/categories/ATV/AP150ST-250 正右侧 投影.png' },
];

const defaultImageFor = (id: string) => DEFAULT_PRODUCT_MENU_GROUPS.find((g) => g.id === id)?.image ?? '';

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const clean = (value?: string) => (value ?? '').trim();

export function slugifyGroupId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

/** Label for the visitor's language, falling back to English and then to any language that has text. */
export function groupLabel(group: ProductMenuGroup, locale: string): string {
  const byLocale: Record<MenuLocale, string> = {
    en: clean(group.labelEn),
    fr: clean(group.labelFr),
    zh: clean(group.labelZh),
  };
  const wanted = (['en', 'fr', 'zh'] as const).includes(locale as MenuLocale) ? (locale as MenuLocale) : 'en';
  return byLocale[wanted] || byLocale.en || byLocale.fr || byLocale.zh || group.id;
}

/** Drops unusable stored entries (bad id, duplicate id, no label at all) so a corrupt value cannot break the menu. */
export function sanitizeGroups(raw: unknown): ProductMenuGroup[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const result: ProductMenuGroup[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const e = entry as Record<string, unknown>;
    const id = typeof e.id === 'string' ? e.id.trim() : '';
    const group: ProductMenuGroup = {
      id,
      labelEn: typeof e.labelEn === 'string' ? e.labelEn : '',
      labelFr: typeof e.labelFr === 'string' ? e.labelFr : '',
      labelZh: typeof e.labelZh === 'string' ? e.labelZh : '',
      // Older saved menus have no picture: fall back to the built-in one for the same group, else none.
      image: typeof e.image === 'string' && isSafeImagePath(e.image) ? e.image.trim() : defaultImageFor(id),
    };
    if (!ID_PATTERN.test(id) || seen.has(id)) continue;
    if (!clean(group.labelEn) && !clean(group.labelFr) && !clean(group.labelZh)) continue;
    seen.add(id);
    result.push(group);
  }
  return result.slice(0, PRODUCT_MENU_LIMITS.maxGroups);
}

/** Problems with one group as the admin edits it, including the required picture. Empty when it can be saved. */
export function validateGroup(group: ProductMenuGroup): AdminProblem[] {
  const errors: AdminProblem[] = [];
  if (!clean(group.labelEn)) errors.push({ key: 'categories.problems.needEnglishName' });
  for (const label of [group.labelEn, group.labelFr, group.labelZh]) {
    if (clean(label).length > PRODUCT_MENU_LIMITS.label) {
      errors.push({ key: 'categories.problems.nameTooLong', values: { max: PRODUCT_MENU_LIMITS.label } });
      break;
    }
  }
  if (!clean(group.image)) errors.push({ key: 'categories.problems.needPicture' });
  else if (!isSafeImagePath(group.image)) errors.push({ key: 'categories.problems.pictureNotUploaded' });
  return errors;
}

/** Problems with the list as a whole (the per-group rules are in {@link validateGroup}). Empty when it is valid. */
export function validateGroups(groups: ProductMenuGroup[]): string[] {
  const errors: string[] = [];
  if (groups.length === 0) errors.push('Keep at least one group, otherwise the Products menu would be empty.');
  if (groups.length > PRODUCT_MENU_LIMITS.maxGroups) errors.push(`At most ${PRODUCT_MENU_LIMITS.maxGroups} groups.`);
  const seen = new Set<string>();
  for (const g of groups) {
    if (!ID_PATTERN.test(g.id)) errors.push(`"${g.id}" is not a valid identifier.`);
    if (seen.has(g.id)) errors.push(`The identifier "${g.id}" is used twice.`);
    seen.add(g.id);
  }
  return errors;
}

/** Replaces the group with the same id, or appends it when new. Never mutates the input. */
export function upsertGroup(groups: ProductMenuGroup[], group: ProductMenuGroup): ProductMenuGroup[] {
  return groups.some((g) => g.id === group.id) ? groups.map((g) => (g.id === group.id ? group : g)) : [...groups, group];
}

export function removeGroup(groups: ProductMenuGroup[], id: string): ProductMenuGroup[] {
  return groups.filter((g) => g.id !== id);
}

/** An identifier not yet used, derived from the English name. */
export function uniqueGroupId(name: string, groups: ProductMenuGroup[]): string {
  const base = slugifyGroupId(name) || 'group';
  const taken = new Set(groups.map((g) => g.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function moveGroup(groups: ProductMenuGroup[], id: string, direction: -1 | 1): ProductMenuGroup[] {
  const from = groups.findIndex((g) => g.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= groups.length) return groups;
  const next = [...groups];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

/**
 * Group the menu files a category under. A category whose group was removed (or never existed) goes to the first
 * group instead of silently disappearing from the site.
 */
export function groupIdForCategory(parentType: string | undefined, groups: ProductMenuGroup[]): string | undefined {
  const wanted = (parentType || 'two-wheeler').toLowerCase();
  return groups.find((g) => g.id === wanted)?.id ?? groups[0]?.id;
}

export interface Grouped<T> {
  /** Categories per group id, in the order they were given. */
  byGroup: Record<string, T[]>;
  /** Categories whose group no longer exists. The public menu files these under the first group. */
  orphans: T[];
}

/** Splits categories into the groups of the menu; used by the admin board and to count what a group holds. */
export function partitionByGroup<T extends { parentType?: string }>(items: T[], groups: ProductMenuGroup[]): Grouped<T> {
  const byGroup: Record<string, T[]> = Object.fromEntries(groups.map((g) => [g.id, [] as T[]]));
  const orphans: T[] = [];
  for (const item of items) {
    const key = (item.parentType || 'two-wheeler').toLowerCase();
    (byGroup[key] ?? orphans).push(item);
  }
  return { byGroup, orphans };
}
