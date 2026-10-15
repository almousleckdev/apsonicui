import { apiClient } from './api-client';
import {
  DEFAULT_PRODUCT_MENU_GROUPS,
  sanitizeGroups,
  type ProductMenuGroup,
} from '@/lib/product-menu/groups';

const CONFIG_KEY = 'product_menu_groups';

interface StoredConfig {
  configValue?: string;
}

export const productMenuService = {
  /** Public. Falls back to the built-in groups when nothing has been saved yet or the value is unusable. */
  async getGroups(): Promise<ProductMenuGroup[]> {
    try {
      const res = await apiClient<StoredConfig>(`/cms/config/${CONFIG_KEY}`, { requiresAuth: false, silent: true });
      if (res.data?.configValue) {
        const groups = sanitizeGroups(JSON.parse(res.data.configValue));
        if (groups.length > 0) return groups;
      }
    } catch {
      // Not saved yet (404) or unreachable: use the defaults.
    }
    return DEFAULT_PRODUCT_MENU_GROUPS;
  },

  /**
   * Admin: applies a change to the freshly loaded list and saves the result. Reading right before writing keeps
   * two admins (or two tabs) from overwriting each other's groups with a stale copy.
   */
  async updateGroups(change: (current: ProductMenuGroup[]) => ProductMenuGroup[]): Promise<ProductMenuGroup[]> {
    const next = change(await this.getGroups());
    await this.saveGroups(next);
    return next;
  },

  async saveGroups(groups: ProductMenuGroup[]): Promise<void> {
    await apiClient(`/admin/cms/config/${CONFIG_KEY}`, {
      method: 'PUT',
      requiresAuth: true,
      body: JSON.stringify({ configValue: JSON.stringify(groups) }),
    });
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('product-menu-updated'));
  },
};
