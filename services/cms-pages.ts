import { apiClient } from './api-client';
import type { CmsPageDto, CmsPageRequest, PageStatus } from '@/lib/types/cms-page';

export const cmsPagesService = {
  async getAdminPages(token?: string): Promise<CmsPageDto[]> {
    const res = await apiClient<any>('/admin/pages', {
      method: 'GET',
      requiresAuth: true,
      silent: true,
    });
    return res.data?.content || [];
  },

  async getAdminPageById(id: number, token?: string): Promise<CmsPageDto> {
    const res = await apiClient<any>(`/admin/pages/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
    return res.data;
  },

  async createPage(payload: CmsPageRequest, token?: string): Promise<CmsPageDto> {
    const res = await apiClient<any>('/admin/pages', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  async updatePage(id: number, payload: CmsPageRequest, token?: string): Promise<CmsPageDto> {
    const res = await apiClient<any>(`/admin/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  async deletePage(id: number, token?: string): Promise<void> {
    await apiClient<any>(`/admin/pages/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  async updateStatus(id: number, status: PageStatus, token?: string): Promise<CmsPageDto> {
    const res = await apiClient<any>(`/admin/pages/${id}/status?status=${status}`, {
      method: 'PATCH',
      requiresAuth: true,
    });
    return res.data;
  },

  async getPublicPageBySlug(slug: string): Promise<CmsPageDto> {
    const res = await apiClient<any>(`/pages/slug/${slug}`, {
      method: 'GET',
      requiresAuth: false,
    });
    return res.data;
  },
  
  async getNavigationTree(): Promise<any[]> {
    const res = await apiClient<any>('/pages/navigation', {
      method: 'GET',
      requiresAuth: false,
    });
    return res.data;
  }
};
