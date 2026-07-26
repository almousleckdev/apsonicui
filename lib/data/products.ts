// Mock products/brands data - replace with GET /api/brands and GET /api/categories
import type {
  Brand,
  ProductCategory,
  DropdownConfig,
} from "@/lib/types/products";

export const BRANDS: Brand[] = [
  {
    id: "apsonic",
    name: "APSONIC",
    slug: "apsonic",
    description: "Quality motorcycles for everyday use",
  },
  {
    id: "apsonic-pro",
    name: "APSONIC PRO",
    slug: "apsonic-pro",
    description: "Premium performance motorcycles",
  },
  {
    id: "apsonic-emoto",
    name: "APSONIC E-MOTO",
    slug: "apsonic-emoto",
    description: "Electric mobility solutions",
  },
];

// Categories organized by brand
export const BRAND_CATEGORIES: Record<string, ProductCategory[]> = {
  apsonic: [
    {
      id: "street",
      name: "街车",
      slug: "street",
      image: "/categories/街车/AP125-27 (2.2).png",
      brandId: "apsonic",
    },
    {
      id: "offroad",
      name: "越野车",
      slug: "offroad",
      image: "/products/AP250GY (1).png",
      imageScale: 1.2,
      imageTranslateY: 6,
      brandId: "apsonic",
    },
    {
      id: "underbone",
      name: "弯梁车",
      slug: "underbone",
      image: "/categories/弯梁车/AP110 (2).png",
      brandId: "apsonic",
    },
    {
      id: "scooter",
      name: "踏板车",
      slug: "scooter",
      image: "/categories/踏板车/AP125T/AP125T 右侧 精修 白（2）.png",
      imageScale: 1.0,
      brandId: "apsonic",
    },
    {
      id: "atv",
      name: "ATV",
      slug: "atv",
      image: "/categories/ATV/AP150ST-250 正右侧 投影.png",
      imageScale: 1.0,
      brandId: "apsonic",
    },
    {
      id: "tricycle",
      name: "三轮车",
      slug: "tricycle",
      image: "/categories/三轮车/AP150ZH-175 更新/AP150ZH-175 MAX (1).png",
      brandId: "apsonic",
    },
  ],
  "apsonic-pro": [
    {
      id: "pro-sport",
      name: "运动型",
      slug: "sport",
      image: "/products/AP125-30（1）.png",
      brandId: "apsonic-pro",
    },
    {
      id: "pro-touring",
      name: "旅行型",
      slug: "touring",
      image: "/products/AP125-12(1).png",
      brandId: "apsonic-pro",
    },
  ],
  "apsonic-emoto": [
    {
      id: "emoto-scooter",
      name: "电动踏板车",
      slug: "e-scooter",
      image: "/products/AP110-A-PLUS(白).png",
      brandId: "apsonic-emoto",
    },
    {
      id: "emoto-bike",
      name: "电动自行车",
      slug: "e-bike",
      image: "/products/AP125-K(1).png",
      brandId: "apsonic-emoto",
    },
  ],
};

// Default categories
export const PRODUCT_CATEGORIES: ProductCategory[] =
  BRAND_CATEGORIES["apsonic"];

// Get dropdown configuration
export function getDropdownConfig(): DropdownConfig {
  return { brands: BRANDS, categories: PRODUCT_CATEGORIES };
}

// Get categories for a specific brand
export function getCategoriesByBrand(brandId: string): ProductCategory[] {
  return BRAND_CATEGORIES[brandId] || PRODUCT_CATEGORIES;
}

// Build product URL from category/brand
export function buildProductUrl(
  category?: ProductCategory,
  brand?: Brand,
): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category.slug);
  if (brand) params.set("brand", brand.slug);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

// Build product detail page URL
export function buildProductDetailUrl(
  productId: string,
  category?: string,
): string {
  return `/products/${productId}`;
}
