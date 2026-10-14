import { apiClient } from './api-client';
import type { PageResponse } from '@/lib/types/api';
import type { CmsPageDto, CmsPageRequest, NavigationItem, PageStatus } from '@/lib/types/cms-page';

export const cmsPagesService = {
  async getAdminPages(): Promise<CmsPageDto[]> {
    const res = await apiClient<PageResponse<CmsPageDto>>('/admin/pages', {
      method: 'GET',
      requiresAuth: true,
      silent: true,
    });
    return res.data?.content || [];
  },

  async getAdminPageById(id: number): Promise<CmsPageDto> {
    const res = await apiClient<CmsPageDto>(`/admin/pages/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
    return res.data;
  },

  async createPage(payload: CmsPageRequest): Promise<CmsPageDto> {
    const res = await apiClient<CmsPageDto>('/admin/pages', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  async updatePage(id: number, payload: CmsPageRequest): Promise<CmsPageDto> {
    const res = await apiClient<CmsPageDto>(`/admin/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  async deletePage(id: number): Promise<void> {
    await apiClient<void>(`/admin/pages/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  async updateStatus(id: number, status: PageStatus): Promise<CmsPageDto> {
    const res = await apiClient<CmsPageDto>(`/admin/pages/${id}/status?status=${status}`, {
      method: 'PATCH',
      requiresAuth: true,
    });
    return res.data;
  },

  async getPublicPageBySlug(slug: string): Promise<CmsPageDto> {
    const res = await apiClient<CmsPageDto>(`/pages/slug/${slug}`, {
      method: 'GET',
      requiresAuth: false,
    });
    return res.data;
  },
  
  async getNavigationTree(): Promise<NavigationItem[]> {
    const res = await apiClient<NavigationItem[]>('/pages/navigation', {
      method: 'GET',
      requiresAuth: false,
    });
    return res.data;
  }
};
