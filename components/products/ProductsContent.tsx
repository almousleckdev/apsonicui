"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProductFilters } from "./ProductFilters";
import { ProductModelCard } from "./ProductModelCard";
import type { ProductFilters as ProductFiltersType } from "@/lib/types/products";
import { useProductFilters } from "@/hooks/useProductFilters";
import { groupProductsByCategory } from "@/lib/data/product-models";
import { motion } from "framer-motion";
import { STAGGER_CONTAINER } from "@/lib/constants/animations";

// Category display order
const CATEGORY_ORDER = [
  "standard",
  "street",
  "offroad",
  "underbone",
  "scooter",
  "atv",
  "tricycle",
];

// Map category slug → translation key
const CATEGORY_KEY_MAP: Record<string, string> = {
  underbone: "categories.underbone",
  standard: "categories.standard",
  street: "categories.street",
  offroad: "categories.offroad",
  scooter: "categories.scooter",
  atv: "categories.atv",
  tricycle: "categories.tricycle",
};

// Map category slugs to filter types
const CATEGORY_SLUG_TO_TYPE: Record<string, string> = {
  underbone: "underbone",
  standard: "standard",
  street: "street",
  offroad: "offroad",
  scooter: "scooter",
  atv: "atv",
  tricycle: "tricycle",
};

function filtersFromSearchParams(searchParams: URLSearchParams): ProductFiltersType {
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const initialFilters: ProductFiltersType = {};
  if (category && CATEGORY_SLUG_TO_TYPE[category]) {
    initialFilters.type = CATEGORY_SLUG_TO_TYPE[category];
  }
  if (brand) {
    initialFilters.brand = brand;
  }
  return initialFilters;
}

export function ProductsContent() {
  const t = useTranslations("products");
  const searchParams = useSearchParams();
  const [prevParams, setPrevParams] = useState(searchParams.toString());
  const [filters, setFilters] = useState<ProductFiltersType>(() =>
    filtersFromSearchParams(searchParams)
  );

  // Sync filters when URL search params change externally (e.g. nav links)
  if (searchParams.toString() !== prevParams) {
    setPrevParams(searchParams.toString());
    setFilters(filtersFromSearchParams(searchParams));
  }

  const filteredProducts = useProductFilters(filters);
  const groupedProducts = groupProductsByCategory(filteredProducts);

  return (
    <main className="min-h-screen bg-white pb-32 overflow-x-hidden">
      <ProductFilters filters={filters} onFilterChange={setFilters} />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-10 py-12 sm:py-20">
        <div className="space-y-20">
          {CATEGORY_ORDER.map((category) => {
            const products = groupedProducts[category];
            if (!products || products.length === 0) return null;

            return (
              <section key={category}>
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                    {t(CATEGORY_KEY_MAP[category])}
                  </h2>
                </div>

                <motion.div
                  variants={STAGGER_CONTAINER}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.05 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 gap-y-12"
                >
                  {products.map((product) => (
                    <ProductModelCard
                      key={product.id}
                      product={product}
                      className="w-full"
                    />
                  ))}
                </motion.div>
              </section>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-300 italic text-2xl">{t("noResults")}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
