import { HomePageConfig, DEFAULT_HOMEPAGE_CONFIG } from '@/lib/types/homepage';
import { apiClient } from './api-client';

const CONFIG_KEY = 'homepage_config';

/** Backend SystemConfig payload: the homepage config is stored as a JSON string. */
interface StoredConfig {
  configValue?: string;
}

export const homepageService = {
  async getHomepageConfig(): Promise<HomePageConfig> {
    try {
      const response = await apiClient<StoredConfig>(`/cms/config/${CONFIG_KEY}`, {
        method: 'GET',
        requiresAuth: false,
        silent: true, // Don't toast if it doesn't exist yet
      });
      
      if (response.data && response.data.configValue) {
        const stored = JSON.parse(response.data.configValue);
        return {
          ...DEFAULT_HOMEPAGE_CONFIG,
          ...stored,
          hero: { ...DEFAULT_HOMEPAGE_CONFIG.hero, ...(stored.hero || {}) },
          visibility: { ...DEFAULT_HOMEPAGE_CONFIG.visibility, ...(stored.visibility || {}) },
        };
      }
    } catch {
      // Not saved yet (404) or unreachable: fall back to the defaults.
    }
    return DEFAULT_HOMEPAGE_CONFIG;
  },

  async saveHomepageConfig(config: HomePageConfig): Promise<HomePageConfig> {
    try {
      await apiClient<StoredConfig>(`/admin/cms/config/${CONFIG_KEY}`, {
        method: 'PUT',
        requiresAuth: true,
        body: JSON.stringify({ configValue: JSON.stringify(config) }),
      });
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('homepage-config-updated'));
      }
      return config;
    } catch (e) {
      console.error('Failed to save homepage config:', e);
      throw e;
    }
  },

  async resetToDefault(): Promise<HomePageConfig> {
    return this.saveHomepageConfig(DEFAULT_HOMEPAGE_CONFIG);
  },
};
