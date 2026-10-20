import { apiClient } from './api-client';
import { unwrapList } from '@/lib/api/unwrap-list';
import type { PageResponse } from '@/lib/types/api';
import type { BackendNewsItem, NewsItem, CreateNewsPayload } from '@/lib/types/news';

type NewsListData = PageResponse<BackendNewsItem> | BackendNewsItem[];

export const newsService = {
  /**
   * Fetch public news articles from live backend DB.
   */
  async getNewsList(locale: string = 'en', category?: string): Promise<NewsItem[]> {
    try {
      const queryParams = new URLSearchParams({ locale, size: '50' });
      if (category && category !== 'ALL') {
        queryParams.set('category', category);
      }

      const res = await apiClient<NewsListData>(`/news?${queryParams.toString()}`, {
        method: 'GET',
        requiresAuth: false,
        silent: true,
      });

      if (res.data) {
        return unwrapList(res.data).map(mapBackendNewsItem);
      }
    } catch (error) {
      console.warn('Backend API /news call exception:', error);
    }

    return [];
  },

  async getNews(locale: string = 'en', category?: string): Promise<NewsItem[]> {
    return newsService.getNewsList(locale, category);
  },

  /**
   * Fetch admin news articles list for dashboard management.
   */
  async getAdminNewsList(): Promise<NewsItem[]> {
    try {
      const res = await apiClient<NewsListData>('/admin/news?size=100', {
        method: 'GET',
        requiresAuth: true,
        silent: true,
      });

      if (res.data) {
        return unwrapList(res.data).map(mapBackendNewsItem);
      }
    } catch (error) {
      console.warn('Backend API /admin/news call exception:', error);
    }

    return [];
  },

  /**
   * Fetch single news story details by ID or Slug.
   */
  async getNewsById(idOrSlug: string, locale: string = 'en'): Promise<NewsItem | null> {
    try {
      const res = await apiClient<BackendNewsItem>(`/news/${idOrSlug}?locale=${locale}`, {
        method: 'GET',
        requiresAuth: false,
        silent: true,
      });

      if (res.data) {
        return mapBackendNewsItem(res.data);
      }
    } catch (error) {
      console.warn(`Backend API /news/${idOrSlug} call exception:`, error);
    }

    return null;
  },

  /**
   * Create a new article in the live backend DB.
   */
  async createNews(payload: CreateNewsPayload): Promise<NewsItem> {
    const res = await apiClient<BackendNewsItem>('/admin/news', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });

    return mapBackendNewsItem(res.data);
  },

  /**
   * Update an existing article in the live backend DB.
   */
  async updateNews(id: string | number, payload: Partial<CreateNewsPayload>): Promise<NewsItem> {
    const res = await apiClient<BackendNewsItem>(`/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });

    return mapBackendNewsItem(res.data);
  },

  /**
   * Toggle published / draft status.
   */
  async togglePublish(id: string | number, published: boolean): Promise<NewsItem> {
    const res = await apiClient<BackendNewsItem>(`/admin/news/${id}/publish?published=${published}`, {
      method: 'PATCH',
      requiresAuth: true,
    });

    return mapBackendNewsItem(res.data);
  },

  /**
   * Delete an article safely from backend DB.
   */
  async deleteNews(id: string | number): Promise<void> {
    await apiClient(`/admin/news/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};

// Backend DTO to Frontend NewsItem Mapper with Robust Language Fallbacks
function mapBackendNewsItem(item: BackendNewsItem): NewsItem {
  const title = item.title || item.titleEn || item.titleFr || item.titleZh || 'Untitled Article';
  const summary = item.summary || item.summaryEn || item.summaryFr || item.summaryZh || '';
  const contentHtml = item.contentHtml || item.contentHtmlEn || item.contentHtmlFr || item.contentHtmlZh || '';

  return {
    id: String(item.id),
    slug: item.slug,
    title,
    // The per-language fields are the stored values (not filled in from another language), so the admin form shows
    // exactly what has been written; visitors get the resolved `title` above.
    titleEn: item.titleEn,
    titleFr: item.titleFr,
    titleZh: item.titleZh,
    excerpt: summary,
    summaryEn: item.summaryEn,
    summaryFr: item.summaryFr,
    summaryZh: item.summaryZh,
    contentHtml,
    contentHtmlEn: item.contentHtmlEn,
    contentHtmlFr: item.contentHtmlFr,
    contentHtmlZh: item.contentHtmlZh,
    date: item.publishedAt || item.createdAt || new Date().toISOString(),
    category: item.category || 'Corporate',
    thumbnail: item.coverImageUrl || '/images/logo/apsoniclogo.png',
    authorName: item.authorName || 'APSONIC Team',
    authorRole: item.authorRole || 'Official Contributor',
    authorImage: item.authorAvatarUrl || '/images/logo/apsoniclogo.png',
    viewsCount: item.viewsCount || 0,
    readTimeMinutes: item.readTimeMinutes || 5,
    published: item.published !== undefined ? item.published : true,
    sections: item.sections || [],
    content: item.content || [],
  };
}
