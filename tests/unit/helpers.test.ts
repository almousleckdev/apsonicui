import { describe, expect, it } from 'vitest';
import { unwrapList } from '@/lib/api/unwrap-list';
import { getPageTitle } from '@/lib/types/cms-page';

describe('unwrapList', () => {
  const page = (content: number[]) => ({ content, pageNumber: 0, pageSize: 10, totalElements: content.length, totalPages: 1, last: true, first: true, empty: !content.length });

  it('reads a Spring page, a bare array, and tolerates a missing payload', () => {
    expect(unwrapList(page([1, 2]))).toEqual([1, 2]);
    expect(unwrapList([3, 4])).toEqual([3, 4]);
    expect(unwrapList(undefined)).toEqual([]);
    expect(unwrapList(null)).toEqual([]);
    expect(unwrapList({ ...page([]), content: undefined as never })).toEqual([]);
  });
});

describe('getPageTitle', () => {
  it('prefers English, then any translation, then the slug', () => {
    expect(getPageTitle({ slug: 's', translations: { en: { title: 'Hello' }, fr: { title: 'Salut' } } })).toBe('Hello');
    expect(getPageTitle({ slug: 's', translations: { fr: { title: 'Salut' } } })).toBe('Salut');
    expect(getPageTitle({ slug: 'my-slug', translations: {} })).toBe('my-slug');
    expect(getPageTitle({ slug: 'my-slug', translations: { en: { title: '' } } })).toBe('my-slug');
  });
});
