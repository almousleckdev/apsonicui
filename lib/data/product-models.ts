import type { ProductModel, ProductFilters } from '@/lib/types/products';
import { TWO_WHEELER_MODELS } from './models/two-wheelers';
import { TRICYCLE_MODELS } from './models/tricycles';

export const PRODUCT_MODELS: ProductModel[] = [
  ...TWO_WHEELER_MODELS,
  ...TRICYCLE_MODELS,
];

export const getAvailableDisplacements = (): number[] => {
  const set = new Set(
    PRODUCT_MODELS.map((p) => p.displacement).filter((d): d is number => typeof d === 'number')
  );
  return Array.from(set).sort((a, b) => a - b);
};

export const filterProducts = (
  productsOrFilters: ProductModel[] | ProductFilters,
  optionalFilters?: ProductFilters
): ProductModel[] => {
  let products: ProductModel[];
  let filters: ProductFilters | undefined;

  if (Array.isArray(productsOrFilters)) {
    products = productsOrFilters;
    filters = optionalFilters;
  } else {
    products = PRODUCT_MODELS;
    filters = productsOrFilters;
  }

  if (!filters) return products;

  const f = filters as any;
  const category = f.selectedCategory || f.category;
  const displacement = f.displacement;
  const search = f.searchQuery || f.search;

  return products.filter((p) => {
    if (category && category !== 'all' && p.category !== category) return false;
    if (displacement && p.displacement !== displacement) return false;
    if (search) {
      const q = search.toLowerCase();
      const match = p.model.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
};

export const groupProductsByCategory = (products: ProductModel[]) => {
  return products.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, ProductModel[]>);
};
