import { describe, expect, it } from 'vitest';
import { unwrapList } from '@/lib/api/unwrap-list';

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
