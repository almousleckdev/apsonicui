import { apiClient } from './api-client';
import type { PageResponse } from '@/lib/types/api';
import type {
  PageDetail, PageDocument, PageStatus, PageSummary, PreviewLink, PreviewPage, PublicPage, RevisionDetail,
  RevisionSummary, SectionTypesResponse, ValidationReport,
} from '@/lib/page-builder/types';

const ADMIN = '/admin/pages';

const post = <T>(url: string, body?: unknown) =>
  apiClient<T>(url, { method: 'POST', requiresAuth: true, body: body === undefined ? undefined : JSON.stringify(body) });

/** Page builder API. The backend is authoritative for validation, permissions and versioning. */
export const pagesService = {
  async list(params: { status?: PageStatus; q?: string; page?: number; size?: number } = {}): Promise<PageResponse<PageSummary>> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.q) query.set('q', params.q);
    query.set('page', String(params.page ?? 0));
    query.set('size', String(params.size ?? 20));
    const res = await apiClient<PageResponse<PageSummary>>(`${ADMIN}?${query}`, { method: 'GET', requiresAuth: true });
    return res.data;
  },

  async get(id: number): Promise<PageDetail> {
    return (await apiClient<PageDetail>(`${ADMIN}/${id}`, { method: 'GET', requiresAuth: true })).data;
  },

  async create(input: { slug: string; title: string; document?: PageDocument }): Promise<PageDetail> {
    return (await post<PageDetail>(ADMIN, input)).data;
  },

  /** Saves the draft only. {@code expectedVersion} is the version the editor last received. */
  async saveDraft(id: number, input: { expectedVersion: number; document: PageDocument; slug?: string }): Promise<PageDetail> {
    const res = await apiClient<PageDetail>(`${ADMIN}/${id}`, {
      method: 'PUT', requiresAuth: true, body: JSON.stringify(input), retryCount: 0,
    });
    return res.data;
  },

  async publish(id: number, expectedVersion: number): Promise<PageDetail> {
    return (await post<PageDetail>(`${ADMIN}/${id}/publish`, { expectedVersion })).data;
  },
  async unpublish(id: number, expectedVersion: number): Promise<PageDetail> {
    return (await post<PageDetail>(`${ADMIN}/${id}/unpublish`, { expectedVersion })).data;
  },
  async archive(id: number, expectedVersion: number): Promise<PageDetail> {
    return (await post<PageDetail>(`${ADMIN}/${id}/archive`, { expectedVersion })).data;
  },
  async restore(id: number, expectedVersion: number): Promise<PageDetail> {
    return (await post<PageDetail>(`${ADMIN}/${id}/restore`, { expectedVersion })).data;
  },
  async duplicate(id: number): Promise<PageDetail> {
    return (await post<PageDetail>(`${ADMIN}/${id}/duplicate`)).data;
  },
  async remove(id: number): Promise<void> {
    await apiClient<void>(`${ADMIN}/${id}`, { method: 'DELETE', requiresAuth: true });
  },

  async validate(id: number): Promise<ValidationReport> {
    return (await post<ValidationReport>(`${ADMIN}/${id}/validate`)).data;
  },
  async revisions(id: number): Promise<RevisionSummary[]> {
    return (await apiClient<RevisionSummary[]>(`${ADMIN}/${id}/revisions`, { method: 'GET', requiresAuth: true })).data;
  },
  async revision(id: number, number: number): Promise<RevisionDetail> {
    return (await apiClient<RevisionDetail>(`${ADMIN}/${id}/revisions/${number}`, { method: 'GET', requiresAuth: true })).data;
  },
  async rollback(id: number, number: number, expectedVersion: number): Promise<PageDetail> {
    return (await post<PageDetail>(`${ADMIN}/${id}/revisions/${number}/rollback`, { expectedVersion })).data;
  },
  async previewToken(id: number): Promise<PreviewLink> {
    return (await post<PreviewLink>(`${ADMIN}/${id}/preview-token`)).data;
  },

  async sectionTypes(): Promise<SectionTypesResponse> {
    return (await apiClient<SectionTypesResponse>(`${ADMIN}/section-types`, { method: 'GET', requiresAuth: true })).data;
  },
  async slugAvailable(slug: string, pageId?: number): Promise<boolean> {
    const query = new URLSearchParams({ slug });
    if (pageId) query.set('pageId', String(pageId));
    const res = await apiClient<{ available: boolean }>(`${ADMIN}/slug-available?${query}`, { method: 'GET', requiresAuth: true, silent: true });
    return res.data.available;
  },

  // --- public (no sign-in) ---
  async getPublic(slug: string): Promise<PublicPage | null> {
    try {
      const res = await apiClient<PublicPage>(`/pages/slug/${encodeURIComponent(slug)}`, { method: 'GET', requiresAuth: false, silent: true, retryCount: 0 });
      return res.data;
    } catch {
      return null;
    }
  },
  async getPreview(id: number, token: string): Promise<PreviewPage | null> {
    try {
      const res = await apiClient<PreviewPage>(`/preview/pages/${id}?token=${encodeURIComponent(token)}`, {
        method: 'GET', requiresAuth: false, silent: true, retryCount: 0,
      });
      return res.data;
    } catch {
      return null;
    }
  },
};
