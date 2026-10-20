import type { PageResponse } from '@/lib/types/api';

/**
 * List endpoints return a Spring page ({ content: [...] }); some older responses were a bare array.
 * Accepting both keeps callers independent of that, and a missing payload becomes an empty list.
 */
export function unwrapList<T>(data: PageResponse<T> | T[] | null | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.content ?? [];
}
