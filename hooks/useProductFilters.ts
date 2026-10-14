"use client";

import { useEffect, useState, useMemo } from "react";
import { filterProducts } from "@/lib/data/product-models";
import { productService } from "@/services/product";
import type { ProductFilters as ProductFiltersType, ProductModel } from "@/lib/types/products";

export const useProductFilters = (filters: ProductFiltersType) => {
  const [liveProducts, setLiveProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService.getProducts({ size: 100 }).then((items) => {
      if (isMounted) {
        if (items && items.length > 0) {
          const mapped: ProductModel[] = items.map((p) => ({
            id: p.slug || String(p.id),
            model: p.model,
            brand: p.brand || "apsonic",
            category: p.categorySlug || p.category?.toLowerCase() || "street",
            displacement: p.displacement,
            image: p.image || "/categories/弯梁车/AP110-A PLUS(白).png",
            brandId: p.brand || "apsonic",
          }));
          setLiveProducts(mapped);
        } else {
          setLiveProducts([]);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return filterProducts(liveProducts, filters);
  }, [liveProducts, filters]);

  return { filteredProducts, loading };
};
