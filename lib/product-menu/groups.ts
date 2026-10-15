export type MenuLocale = 'en' | 'fr' | 'zh';

/** A top-level entry of the Products menu ("Two-wheeler", ...). Categories point at it through their `parentType`. */
export interface ProductMenuGroup {
  /** Stable identifier stored in each category's `parentType`; never changes after creation. */
  id: string;
  labelEn: string;
  labelFr: string;
  labelZh: string;
}

export const PRODUCT_MENU_LIMITS = { maxGroups: 8, label: 40 } as const;

export const DEFAULT_PRODUCT_MENU_GROUPS: ProductMenuGroup[] = [
  { id: 'two-wheeler', labelEn: 'Two-wheeler', labelFr: 'Deux-roues', labelZh: '两轮车' },
  { id: 'three-wheeler', labelEn: 'Three-wheeler', labelFr: 'Trois-roues', labelZh: '三轮车' },
  { id: 'atv', labelEn: 'All-Terrain (ATV)', labelFr: 'Tout-terrain (ATV)', labelZh: '全地形' },
];

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
    };
    if (!ID_PATTERN.test(id) || seen.has(id)) continue;
    if (!clean(group.labelEn) && !clean(group.labelFr) && !clean(group.labelZh)) continue;
    seen.add(id);
    result.push(group);
  }
  return result.slice(0, PRODUCT_MENU_LIMITS.maxGroups);
}

/** Error messages that block saving; empty when the list is valid. */
export function validateGroups(groups: ProductMenuGroup[]): string[] {
  const errors: string[] = [];
  if (groups.length === 0) errors.push('Keep at least one group, otherwise the Products menu would be empty.');
  if (groups.length > PRODUCT_MENU_LIMITS.maxGroups) errors.push(`At most ${PRODUCT_MENU_LIMITS.maxGroups} groups.`);
  const seen = new Set<string>();
  groups.forEach((g, i) => {
    const row = `Group ${i + 1}`;
    if (!clean(g.labelEn)) errors.push(`${row}: the English name is required.`);
    if (!ID_PATTERN.test(g.id)) errors.push(`${row}: the identifier must use lowercase letters, digits and dashes.`);
    if (seen.has(g.id)) errors.push(`${row}: the identifier "${g.id}" is used twice.`);
    seen.add(g.id);
    for (const label of [g.labelEn, g.labelFr, g.labelZh]) {
      if (clean(label).length > PRODUCT_MENU_LIMITS.label) {
        errors.push(`${row}: names are limited to ${PRODUCT_MENU_LIMITS.label} characters.`);
        break;
      }
    }
  });
  return errors;
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

/** Number of categories attached to each group id (used to block deleting a group that is still in use). */
export function countByGroup(categories: Array<{ parentType?: string }>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of categories) {
    const key = (c.parentType || 'two-wheeler').toLowerCase();
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/**
 * Group the menu files a category under. A category whose group was removed (or never existed) goes to the first
 * group instead of silently disappearing from the site.
 */
export function groupIdForCategory(parentType: string | undefined, groups: ProductMenuGroup[]): string | undefined {
  const wanted = (parentType || 'two-wheeler').toLowerCase();
  return groups.find((g) => g.id === wanted)?.id ?? groups[0]?.id;
}
