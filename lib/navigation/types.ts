import type { AdminKey } from '@/lib/i18n/admin/catalog';
import type { LocalizedText, PageStatus } from '@/lib/page-builder/types';

export type MenuKey = 'header' | 'footer';
export type ItemKind = 'PAGE' | 'ROUTE' | 'EXTERNAL' | 'GROUP';

/** One entry of a menu as authored. Page entries point at a page by id, never by address. */
export interface MenuItem {
  id: string;
  kind: ItemKind;
  pageId?: number;
  route?: string;
  url?: string;
  labels: LocalizedText;
  visible: boolean;
  openInNewTab: boolean;
  children: MenuItem[];
}

export interface MenuView {
  menu: string;
  version: number;
  draft: MenuItem[];
  published: MenuItem[];
  hasUnpublishedChanges: boolean;
  configured: boolean;
  publishedAt?: string;
  publishedBy?: string;
}

export interface PageOption {
  id: number;
  slug: string;
  title: string;
  status: PageStatus;
}

/** A menu entry as the website renders it. */
export interface ResolvedItem {
  id: string;
  kind: ItemKind;
  labels: LocalizedText;
  href?: string | null;
  openInNewTab: boolean;
  pending: boolean;
  children: ResolvedItem[];
}

export interface ResolvedMenu {
  menu: string;
  /** False until the menu was first published: the site then keeps its built-in navigation. */
  configured: boolean;
  items: ResolvedItem[];
}

/** Built-in pages a menu may point at (the backend accepts exactly these). */
export const BUILT_IN_ROUTES: Array<{ route: string; label: AdminKey }> = [
  { route: '/', label: 'navigation.routes.home' },
  { route: '/products', label: 'navigation.routes.products' },
  { route: '/services', label: 'navigation.routes.services' },
  { route: '/news', label: 'navigation.routes.news' },
  { route: '/contact', label: 'navigation.routes.contact' },
];

/** Levels allowed per menu (mirrors the backend). */
export const MENU_MAX_DEPTH: Record<MenuKey, number> = { header: 3, footer: 2 };
