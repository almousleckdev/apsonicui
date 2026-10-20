import { apiClient } from './api-client';
import type { MenuItem, MenuKey, MenuView, PageOption, ResolvedMenu } from '@/lib/navigation/types';

const ADMIN = '/admin/navigation';

/** Header and footer menus. The backend validates every save and publish. */
export const navigationService = {
  async get(menu: MenuKey): Promise<MenuView> {
    return (await apiClient<MenuView>(`${ADMIN}/${menu}`, { method: 'GET', requiresAuth: true })).data;
  },
  async pageOptions(): Promise<PageOption[]> {
    return (await apiClient<PageOption[]>(`${ADMIN}/page-options`, { method: 'GET', requiresAuth: true })).data;
  },
  async saveDraft(menu: MenuKey, expectedVersion: number, items: MenuItem[]): Promise<MenuView> {
    const res = await apiClient<MenuView>(`${ADMIN}/${menu}`, {
      method: 'PUT', requiresAuth: true, retryCount: 0, body: JSON.stringify({ expectedVersion, items }),
    });
    return res.data;
  },
  /** Keeps a removed item (and everything under it) in the trash so it can be restored. */
  async trashItem(menu: MenuKey, item: MenuItem, title: string): Promise<MenuView> {
    const res = await apiClient<MenuView>(`${ADMIN}/${menu}/trash`, {
      method: 'POST', requiresAuth: true, retryCount: 0, body: JSON.stringify({ item, title }),
    });
    return res.data;
  },
  /** Takes the menu offline so the website shows its built-in version again. The draft is kept. */
  async resetToOriginal(menu: MenuKey, expectedVersion: number): Promise<MenuView> {
    const res = await apiClient<MenuView>(`${ADMIN}/${menu}/reset`, {
      method: 'POST', requiresAuth: true, retryCount: 0, body: JSON.stringify({ expectedVersion }),
    });
    return res.data;
  },
  /** Lists a page under a footer section (created when new). Takes effect immediately; no editor needed. */
  async showPageInFooter(pageId: number, section: string): Promise<void> {
    await apiClient<void>(`${ADMIN}/footer/pages/${pageId}`, {
      method: 'PUT', requiresAuth: true, retryCount: 0, body: JSON.stringify({ section }),
    });
  },
  async hidePageFromFooter(pageId: number): Promise<void> {
    await apiClient<void>(`${ADMIN}/footer/pages/${pageId}`, { method: 'DELETE', requiresAuth: true, retryCount: 0 });
  },
  async publish(menu: MenuKey, expectedVersion: number): Promise<MenuView> {
    const res = await apiClient<MenuView>(`${ADMIN}/${menu}/publish`, {
      method: 'POST', requiresAuth: true, retryCount: 0, body: JSON.stringify({ expectedVersion }),
    });
    return res.data;
  },
  async discard(menu: MenuKey, expectedVersion: number): Promise<MenuView> {
    const res = await apiClient<MenuView>(`${ADMIN}/${menu}/discard`, {
      method: 'POST', requiresAuth: true, retryCount: 0, body: JSON.stringify({ expectedVersion }),
    });
    return res.data;
  },

  /** What the website shows. Returns null if the API is unreachable, so callers fall back to the built-in menu. */
  async getPublished(menu: MenuKey): Promise<ResolvedMenu | null> {
    try {
      const res = await apiClient<ResolvedMenu>(`/navigation/${menu}`, { method: 'GET', requiresAuth: false, silent: true, retryCount: 0 });
      return res.data;
    } catch {
      return null;
    }
  },
};
