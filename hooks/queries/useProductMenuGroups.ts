'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productMenuService } from '@/services/product-menu-service';
import { DEFAULT_PRODUCT_MENU_GROUPS, type ProductMenuGroup } from '@/lib/product-menu/groups';

const KEY = ['product-menu-groups'] as const;

/** The Products menu groups for the admin, with a helper that saves a change against the latest saved list. */
export function useProductMenuGroups() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: KEY, queryFn: () => productMenuService.getGroups(), staleTime: 0 });

  const update = async (change: (current: ProductMenuGroup[]) => ProductMenuGroup[]) => {
    const next = await productMenuService.updateGroups(change);
    queryClient.setQueryData(KEY, next);
    return next;
  };

  return {
    groups: query.data ?? DEFAULT_PRODUCT_MENU_GROUPS,
    loading: query.isFetching,
    update,
  };
}
