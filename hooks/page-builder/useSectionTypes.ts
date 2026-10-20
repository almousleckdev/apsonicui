'use client';

import { useQuery } from '@tanstack/react-query';
import { pagesService } from '@/services/pages';
import type { SectionDefinition, SectionTypesResponse } from '@/lib/page-builder/types';

/** The section catalogue from the backend: the single source of fields, limits and defaults. */
export function useSectionTypes() {
  const query = useQuery({
    queryKey: ['page-builder', 'section-types'],
    queryFn: () => pagesService.sectionTypes(),
    staleTime: 10 * 60 * 1000,
  });
  const data: SectionTypesResponse | undefined = query.data;
  const byType = new Map<string, SectionDefinition>((data?.sections ?? []).map((d) => [d.type, d]));
  return { ...query, definitions: data?.sections ?? [], styleFields: data?.styleFields ?? [], byType };
}
