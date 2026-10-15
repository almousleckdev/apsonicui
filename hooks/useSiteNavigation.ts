'use client';

import { useQuery } from '@tanstack/react-query';
import { navigationService } from '@/services/navigation';
import type { MenuKey } from '@/lib/navigation/types';

/**
 * The published menu for the public site. While it loads, or when the menu has never been published (or the API
 * is unreachable), the data is empty/unconfigured and callers show the built-in navigation instead.
 */
export function useSiteNavigation(menu: MenuKey) {
  return useQuery({
    queryKey: ['site-navigation', menu],
    queryFn: () => navigationService.getPublished(menu),
    staleTime: 60_000,
  });
}
