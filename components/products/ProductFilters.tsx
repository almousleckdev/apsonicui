"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CATEGORY_OPTIONS } from "@/lib/data/filters";
import { getAvailableDisplacements } from "@/lib/data/product-models";
import { BRANDS } from "@/lib/data/products";
import type { ProductFilters as ProductFiltersType } from "@/lib/types/products";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion, AnimatePresence } from "framer-motion";

interface FilterOption<T = string> {
  value: T;
  label: string;
}

interface FilterOptionGroupProps<T extends string | number> {
  title: string;
  options: FilterOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  layoutId: string;
  isUppercase?: boolean;
}

function FilterOptionGroup<T extends string | number>({
  title,
  options,
  selectedValue,
  onSelect,
  layoutId,
  isUppercase = false,
}: FilterOptionGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap pt-1 min-w-[72px] text-left">
        {title}
      </span>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {options.map((opt) => {
          const isActive = opt.value === selectedValue;
            return (
              <button
                key={String(opt.value)}
                onClick={() => onSelect(opt.value)}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer",
                  isUppercase && "uppercase tracking-wide",
                  isActive
                    ? "bg-brand-green text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 rounded-full bg-brand-green -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {opt.label}
              </button>
            );
        })}
      </div>
    </div>
  );
}

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (filters: ProductFiltersType) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const t = useTranslations("products");
  const [isExpanded, setIsExpanded] = useState(false);
  const { isScrolled: isSticky, isVisible: showHeader } = useScrollDirection({
    scrolledThreshold: 100,
  });

  const categoryOptions = useMemo<FilterOption<string>[]>(
    () =>
      CATEGORY_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.value === "" ? t("filterAll") : t(`categories.${opt.value}`),
      })),
    [t]
  );

  const displacementOptions = useMemo<FilterOption<number>[]>(() => {
    const displacements = getAvailableDisplacements();
    return [
      { value: 0, label: t("filterAllDisp") },
      ...displacements.map((d) => ({ value: d, label: d.toString() })),
    ];
  }, [t]);

  const brandOptions = useMemo<FilterOption<string>[]>(
    () => [
      { value: "", label: t("filterAll") },
      ...BRANDS.map((b) => ({ value: b.id, label: b.name })),
    ],
    [t]
  );

  return (
    <div className="w-full bg-white pt-24 sm:pt-32 border-b border-gray-100 select-none">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-10 pb-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8" aria-label="Breadcrumb">
          <span className="hover:text-gray-600 cursor-pointer">{t("breadcrumbHome")}</span>
          <span>/</span>
          <span className="hover:text-gray-600 cursor-pointer text-gray-900">{t("breadcrumbProducts")}</span>
        </nav>
      </div>

      {/* Sticky placeholder + filter bar */}
      <div className={cn(isSticky ? (isExpanded ? "h-[500px] md:h-[400px]" : "h-[100px]") : "h-auto")}>
        <div
          className={cn(
            "w-full transition-all duration-300 border-t border-transparent",
            isSticky
              ? "fixed z-50 left-0 right-0 bg-white shadow-md py-6 border-gray-100"
              : "relative bg-white pb-10",
            isSticky && (showHeader ? "top-20" : "top-0")
          )}
        >
          <div className="max-w-[1360px] mx-auto px-4 sm:px-10">
            <div
              className={cn(
                "flex items-center justify-between gap-4 transition-all duration-300",
                isSticky ? "flex-row" : "flex-col md:flex-row md:items-center mb-12"
              )}
            >
              {/* Title (only shown when not sticky) */}
              {!isSticky && (
                <h1 className="text-2xl sm:text-[40px] font-bold text-gray-900 transition-opacity duration-300">
                  {t("heading")}
                </h1>
              )}

              {/* Search */}
              <div className={cn("transition-all duration-300", isSticky ? "flex-1" : "w-full md:w-[320px]")}>
                <div className="relative">
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={filters.search || ""}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        search: e.target.value || undefined,
                      })
                    }
                    className={cn(
                      "w-full pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all",
                      isSticky ? "py-2 text-sm" : "py-3 text-base"
                    )}
                  />
                </div>
              </div>

              {/* Filter toggle (sticky only) */}
              {isSticky && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all shadow-sm whitespace-nowrap cursor-pointer",
                    isExpanded
                      ? "bg-brand-green text-white border-brand-green"
                      : "bg-white text-gray-700 border-gray-200 hover:border-brand-green hover:text-brand-green"
                  )}
                >
                  <span>{isExpanded ? t("filterCollapse") : t("filterExpand")}</span>
                  <span className={cn("transition-transform duration-300", isExpanded && "rotate-180")}>⌄</span>
                </button>
              )}
            </div>

            {/* Filter selection grid — collapsible when sticky */}
            <AnimatePresence initial={false}>
              {(!isSticky || isExpanded) && (
                <motion.div
                  key="filters"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-5 text-[13px] mt-6">
                    <FilterOptionGroup
                      title={t("filterTypeLabel")}
                      options={categoryOptions}
                      selectedValue={filters.type || ""}
                      onSelect={(val) =>
                        onFilterChange({ ...filters, type: val || undefined })
                      }
                      layoutId="activeFilterType"
                    />

                    <FilterOptionGroup
                      title={t("filterDispLabel")}
                      options={displacementOptions}
                      selectedValue={filters.displacement || 0}
                      onSelect={(val) =>
                        onFilterChange({ ...filters, displacement: val || undefined })
                      }
                      layoutId="activeFilterDisplacement"
                    />

                    <FilterOptionGroup
                      title={t("filterBrandLabel")}
                      options={brandOptions}
                      selectedValue={filters.brand || ""}
                      onSelect={(val) =>
                        onFilterChange({ ...filters, brand: val || undefined })
                      }
                      layoutId="activeFilterBrand"
                      isUppercase
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
