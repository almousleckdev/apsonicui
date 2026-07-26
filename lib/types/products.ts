export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  brandId?: string;
  imageScale?: number;
  imageTranslateY?: number;
}

export interface DropdownConfig {
  brands: Brand[];
  categories: ProductCategory[];
}

export interface ProductModel {
  id: string;
  model: string;
  brand: string;
  category: string;
  displacement?: number;
  image: string;
  brandId?: string;
}

export interface ProductFeature {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
}

export interface EngineSpec {
  label: string;
  value: string;
}

export interface GridFeature {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface KeyMetric {
  label: string;
  value: string;
  unit: string;
  subValue?: string;
}

export interface TechSpecItem {
  label: string;
  value: string;
}

export interface ProductColor {
  id: string;
  name: string;
  colorCode: string;
  image: string;
}

export interface ProductDetailData {
  features: ProductFeature[];
  engineSpecs: EngineSpec[];
  gridFeatures: GridFeature[];
  keyMetrics: KeyMetric[];
  detailedSpecs: TechSpecItem[];
}

export interface ProductFilters {
  type?: string;
  displacement?: number;
  brand?: string;
  search?: string;
}

export interface FeaturedModel {
  id: string;
  name: string;
  image: string;
  watermark?: string;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
    image: string;
  }>;
  href?: string;
}

export interface MotorcycleCategory {
  id: string;
  name: string;
  image: string;
  href: string;
  imageClassName?: string;
}
