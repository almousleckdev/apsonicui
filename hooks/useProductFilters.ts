// Product filtering logic hook - delegates to filterProducts util
import { useMemo } from 'react';
import { filterProducts } from '@/lib/data/product-models';
import type { ProductFilters as ProductFiltersType } from '@/lib/types/products';

export const useProductFilters = (filters: ProductFiltersType) => {
  const filteredProducts = useMemo(() => {
    return filterProducts(filters);
  }, [filters]);

  return filteredProducts;
};
