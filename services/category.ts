import { apiClient } from './api-client';

export interface CategoryItem {
  id: number;
  slug: string;
  name?: string;
  nameEn?: string;
  nameFr?: string;
  nameZh?: string;
  imageUrl?: string;
  brand: string;
  parentType?: string;
  imageScale?: number;
  imageTranslateY?: number;
  displayOrder: number;
  active: boolean;
  productCount?: number;
}

export interface CreateCategoryPayload {
  slug: string;
  nameEn: string;
  nameFr?: string;
  nameZh?: string;
  imageUrl?: string;
  brand?: string;
  parentType?: string;
  imageScale?: number;
  imageTranslateY?: number;
  displayOrder?: number;
  active?: boolean;
}

export const categoryService = {
  /**
   * Public: Get all active categories grouped by brand.
   */
  async getPublicCategories(brand?: string): Promise<CategoryItem[]> {
    const query = brand ? `?brand=${encodeURIComponent(brand)}` : '';
    const res = await apiClient<CategoryItem[]>(`/categories${query}`, {
      requiresAuth: false,
      silent: true,
      retryCount: 1,
    });
    return res.data;
  },

  /**
   * Public: Get single category by slug or id.
   */
  async getCategory(idOrSlug: number | string): Promise<CategoryItem> {
    const res = await apiClient<CategoryItem>(`/categories/${idOrSlug}`, {
      requiresAuth: false,
      silent: true,
      retryCount: 1,
    });
    return res.data;
  },

  /**
   * Admin: Get all categories (both active and inactive).
   */
  async getAdminCategories(): Promise<CategoryItem[]> {
    const res = await apiClient<CategoryItem[]>('/admin/categories', {
      requiresAuth: true,
    });
    return res.data;
  },

  /**
   * Admin: Create new category.
   */
  async createCategory(payload: CreateCategoryPayload): Promise<CategoryItem> {
    const res = await apiClient<CategoryItem>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  /**
   * Admin: Update category.
   */
  async updateCategory(id: number | string, payload: Partial<CreateCategoryPayload>): Promise<CategoryItem> {
    const res = await apiClient<CategoryItem>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  /**
   * Admin: Toggle category active status.
   */
  async toggleActive(id: number | string, active: boolean): Promise<CategoryItem> {
    const res = await apiClient<CategoryItem>(`/admin/categories/${id}/toggle-active?active=${active}`, {
      method: 'PATCH',
      requiresAuth: true,
    });
    return res.data;
  },

  /**
   * Admin: Delete category.
   */
  async deleteCategory(id: number | string): Promise<void> {
    await apiClient(`/admin/categories/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};
