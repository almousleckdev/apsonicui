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
export const BUILT_IN_ROUTES: Array<{ route: string; label: string }> = [
  { route: '/', label: 'Home' },
  { route: '/products', label: 'Products (with the product menu)' },
  { route: '/services', label: 'Services' },
  { route: '/news', label: 'News' },
  { route: '/contact', label: 'Contact us' },
];

/** Levels allowed per menu (mirrors the backend). */
export const MENU_MAX_DEPTH: Record<MenuKey, number> = { header: 3, footer: 2 };
