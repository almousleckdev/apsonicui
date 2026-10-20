import { localized } from '@/lib/page-builder/document';
import type { Locale } from '@/lib/page-builder/types';
import type { ResolvedItem } from './types';

/** A menu entry shaped for the header, drawer and footer components. */
export interface SiteNavItem {
  id: string;
  label: string;
  /** Null for a heading that only groups the items under it. */
  href: string | null;
  /** The Products entry keeps the site's product mega menu. */
  hasDropdown?: boolean;
  newTab: boolean;
  external: boolean;
  children: SiteNavItem[];
}

export const isExternalHref = (href: string) => !href.startsWith('/');

export function toSiteItems(items: ResolvedItem[], locale: Locale): SiteNavItem[] {
  return items.map((item) => {
    const href = item.href ?? null;
    return {
      id: item.id,
      label: localized(item.labels, locale) || (href ?? ''),
      href,
      hasDropdown: href === '/products' && item.kind === 'ROUTE' ? true : undefined,
      newTab: item.openInNewTab,
      external: href !== null && isExternalHref(href),
      children: toSiteItems(item.children, locale),
    };
  });
}

export interface FooterColumn {
  title: string;
  items: Array<{ label: string; href: string | null; external: boolean; newTab: boolean }>;
}

const QUICK_LINKS: Record<Locale, string> = { en: 'Quick links', fr: 'Liens rapides', zh: '快速链接' };

/**
 * Footer columns from a published footer menu: every top-level entry with items under it is a column; top-level
 * entries without items are gathered into one "Quick links" column, kept in their original place.
 */
export function toFooterColumns(items: ResolvedItem[], locale: Locale): FooterColumn[] {
  const site = toSiteItems(items, locale);
  const columns: FooterColumn[] = [];
  let quick: FooterColumn | null = null;
  for (const entry of site) {
    if (entry.children.length > 0) {
      columns.push({
        title: entry.label,
        items: entry.children.map((c) => ({ label: c.label, href: c.href, external: c.external, newTab: c.newTab })),
      });
    } else if (entry.href) {
      if (!quick) {
        quick = { title: QUICK_LINKS[locale], items: [] };
        columns.push(quick);
      }
      quick.items.push({ label: entry.label, href: entry.href, external: entry.external, newTab: entry.newTab });
    }
  }
  return columns;
}
