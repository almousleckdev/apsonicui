/**
 * The admin shows every label in Chinese and English together (Chinese first, drawn larger). Each string lives once in
 * the catalog as an [English, Chinese] pair, so the two languages can never drift apart. People who prefer a single
 * language can hide the other with the display mode; it is a preference, kept in a cookie so the server renders it.
 */

export const ADMIN_TEXT_COOKIE = 'ADMIN_TEXT';
export const ADMIN_TEXT_MODES = ['both', 'en', 'zh'] as const;
export type AdminTextMode = (typeof ADMIN_TEXT_MODES)[number];
export const DEFAULT_ADMIN_TEXT_MODE: AdminTextMode = 'both';

export function normalizeAdminTextMode(value: string | undefined | null): AdminTextMode {
  return (ADMIN_TEXT_MODES as readonly string[]).includes(value ?? '') ? (value as AdminTextMode) : DEFAULT_ADMIN_TEXT_MODE;
}

/** One string in both languages. */
export type Pair = readonly [en: string, zh: string];
export interface CatalogNode {
  readonly [key: string]: Pair | CatalogNode;
}

type IcuMessages = { [key: string]: string | IcuMessages };

const isPair = (node: Pair | CatalogNode): node is Pair => Array.isArray(node);

/** Splits a catalog of [en, zh] pairs into one message tree per language. */
export function splitCatalog(catalog: CatalogNode): { en: IcuMessages; zh: IcuMessages } {
  const en: IcuMessages = {};
  const zh: IcuMessages = {};
  for (const [key, node] of Object.entries(catalog)) {
    if (isPair(node)) {
      en[key] = node[0];
      zh[key] = node[1];
    } else {
      const child = splitCatalog(node);
      en[key] = child.en;
      zh[key] = child.zh;
    }
  }
  return { en, zh };
}

/** Dotted paths to every pair in a catalog, e.g. "nav.dashboard". */
export type CatalogKey<C> = C extends Pair
  ? never
  : { [K in keyof C & string]: C[K] extends Pair ? K : `${K}.${CatalogKey<C[K]>}` }[keyof C & string];
