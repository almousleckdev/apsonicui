import { unwrapList } from '@/lib/api/unwrap-list';
import type { PageResponse } from '@/lib/types/api';
import { apiClient } from './api-client';

export interface ProductListItem {
  id: number;
  slug: string;
  model: string;
  brand: string;
  category: string;
  categorySlug: string;
  displacement?: number;
  image: string;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  viewsCount: number;
}

export interface ProductColorPayload {
  id?: number;
  colorName: string;
  hexCode: string;
  imageUrl: string;
  displayOrder?: number;
}

export interface ProductSpecBannerPayload {
  id?: number;
  imageUrl: string;
  title?: string;
  description?: string;
  metricLabel?: string;
  metricValue?: string;
  metricUnit?: string;
  displayOrder?: number;
}

export interface ProductSpecPayload {
  id?: number;
  specKey: string;
  specValue: string;
  specGroup?: string;
  unit?: string;
  isKeyMetric?: boolean;
  displayOrder?: number;
}

export interface ProductReviewPayload {
  id?: number;
  authorName: string;
  rating: number;
  comment: string;
  reviewDate?: string;
}

export interface ProductDetailItem {
  id: number;
  slug: string;
  modelName: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  displacement?: number;
  coverImageUrl: string;
  heroImageUrl?: string;
  performanceImageUrl?: string;
  storyTitle?: string;
  storyDescription?: string;
  storyBackgroundImage?: string;
  aestheticTitle?: string;
  aestheticSubtitle?: string;
  aestheticBgImage?: string;
  aestheticImage1?: string;
  aestheticImage2?: string;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  viewsCount: number;
  colors: ProductColorPayload[];
  specBanners: ProductSpecBannerPayload[];
  specs: ProductSpecPayload[];
  reviews: ProductReviewPayload[];
}

export interface CreateProductPayload {
  slug?: string;
  modelName: string;
  categoryId: number;
  brand?: string;
  displacement?: number;
  coverImageUrl: string;
  heroImageUrl?: string;
  performanceImageUrl?: string;
  storyTitle?: string;
  storyDescription?: string;
  storyBackgroundImage?: string;
  aestheticTitle?: string;
  aestheticSubtitle?: string;
  aestheticBgImage?: string;
  aestheticImage1?: string;
  aestheticImage2?: string;
  featured?: boolean;
  active?: boolean;
  displayOrder?: number;
  colors?: ProductColorPayload[];
  specBanners?: ProductSpecBannerPayload[];
  specs?: ProductSpecPayload[];
  reviews?: ProductReviewPayload[];
}

export const productService = {
  async getProducts(params?: {
    category?: string;
    displacement?: number;
    brand?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<ProductListItem[]> {
    try {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.displacement) q.set('displacement', String(params.displacement));
      if (params?.brand) q.set('brand', params.brand);
      if (params?.search) q.set('search', params.search);
      if (params?.size) q.set('size', String(params.size));

      const res = await apiClient<PageResponse<ProductListItem> | ProductListItem[]>(`/products?${q.toString()}`, {
        method: 'GET',
        requiresAuth: false,
        silent: true,
      });
      return unwrapList(res.data);
    } catch {
      return [];
    }
  },

  async getFeaturedProducts(): Promise<ProductListItem[]> {
    try {
      const res = await apiClient<ProductListItem[]>('/products/featured', {
        method: 'GET',
        requiresAuth: false,
        silent: true,
      });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getDisplacements(): Promise<number[]> {
    try {
      const res = await apiClient<number[]>('/products/displacements', {
        method: 'GET',
        requiresAuth: false,
        silent: true,
      });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getProductDetail(idOrSlug: string, locale: string = 'en'): Promise<ProductDetailItem | null> {
    try {
      const res = await apiClient<ProductDetailItem>(`/products/${idOrSlug}?locale=${locale}`, {
        method: 'GET',
        requiresAuth: false,
        silent: true,
      });
      return res.data || null;
    } catch {
      return null;
    }
  },

  async getAdminProducts(params?: { category?: string; brand?: string; search?: string }): Promise<ProductListItem[]> {
    const q = new URLSearchParams({ size: '100' });
    if (params?.category) q.set('category', params.category);
    if (params?.brand) q.set('brand', params.brand);
    if (params?.search) q.set('search', params.search);

    const res = await apiClient<PageResponse<ProductListItem> | ProductListItem[]>(`/admin/products?${q.toString()}`, {
      method: 'GET',
      requiresAuth: true,
    });
    return unwrapList(res.data);
  },

  async createProduct(payload: CreateProductPayload): Promise<ProductDetailItem> {
    const res = await apiClient<ProductDetailItem>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  async updateProduct(id: number | string, payload: Partial<CreateProductPayload>): Promise<ProductDetailItem> {
    const res = await apiClient<ProductDetailItem>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  async deleteProduct(id: number | string): Promise<void> {
    await apiClient<void>(`/admin/products/${id}`, { method: 'DELETE', requiresAuth: true });
  },

  async toggleActive(id: number | string, active?: boolean): Promise<ProductDetailItem> {
    const query = active !== undefined ? `?active=${active}` : '';
    const res = await apiClient<ProductDetailItem>(`/admin/products/${id}/toggle-active${query}`, {
      method: 'PATCH',
      requiresAuth: true,
    });
    return res.data;
  },

  async toggleFeatured(id: number | string, featured?: boolean): Promise<ProductDetailItem> {
    const query = featured !== undefined ? `?featured=${featured}` : '';
    const res = await apiClient<ProductDetailItem>(`/admin/products/${id}/toggle-featured${query}`, {
      method: 'PATCH',
      requiresAuth: true,
    });
    return res.data;
  },
};
