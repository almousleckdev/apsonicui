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
