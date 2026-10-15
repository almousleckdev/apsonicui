"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ENTERPRISE_EASE } from "@/lib/constants/animations";
import { categoryService, CategoryItem } from "@/services/category";
import { productMenuService } from "@/services/product-menu-service";
import {
  DEFAULT_PRODUCT_MENU_GROUPS,
  groupIdForCategory,
  groupLabel,
  type ProductMenuGroup,
} from "@/lib/product-menu/groups";
import { cn } from "@/lib/utils";
import { isSafeImagePath } from "@/lib/media/safe-path";

interface ProductsDropdownProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  onClose?: () => void;
}

const SIDEBAR_TITLES: Record<string, string> = {
  zh: "车型类别",
  en: "VEHICLE CATEGORIES",
  fr: "CATÉGORIES DE VÉHICULES",
};

const DEFAULT_SUBCATEGORIES_MAP: Record<
  string,
  Array<{
    id: string;
    label: Record<string, string>;
    image: string;
    href: string;
  }>
> = {
  "two-wheeler": [
    {
      id: "standard",
      label: { zh: "骑士车", en: "Knight", fr: "Knight" },
      image: "/categories/骑士车/AP125-K(1.2).png",
      href: "/products?category=standard",
    },
    {
      id: "street",
      label: { zh: "街车", en: "Street", fr: "Street" },
      image: "/categories/街车/AP125-27 (2.2).png",
      href: "/products?category=street",
    },
    {
      id: "underbone",
      label: { zh: "弯梁车", en: "Underbone", fr: "Underbone" },
      image: "/categories/弯梁车/AP110 (2).png",
      href: "/products?category=underbone",
    },
    {
      id: "scooter",
      label: { zh: "踏板车", en: "Scooter", fr: "Scooter" },
      image: "/categories/踏板车/AP125T-4 (2).png",
      href: "/products?category=scooter",
    },
  ],
  "three-wheeler": [
    {
      id: "tricycle",
      label: { zh: "货运三轮车", en: "Cargo Tricycle", fr: "Tricycle Cargo" },
      image: "/categories/三轮车/AP200ZH-B (2.2).png",
      href: "/products?category=tricycle",
    },
  ],
  atv: [
    {
      id: "atv",
      label: { zh: "全地形车", en: "All-Terrain (ATV)", fr: "Tout-terrain (ATV)" },
      image: "/categories/骑士车/AP125-K(1.2).png",
      href: "/products?category=atv",
    },
  ],
};

export const ProductsDropdown: React.FC<ProductsDropdownProps> = ({
  onMouseEnter,
  onMouseLeave,
  className,
  onClose,
}) => {
  const locale = useLocale();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [dbCategories, setDbCategories] = useState<CategoryItem[]>([]);
  const [groups, setGroups] = useState<ProductMenuGroup[]>(DEFAULT_PRODUCT_MENU_GROUPS);

  useEffect(() => {
    categoryService.getPublicCategories().then((data: CategoryItem[]) => {
      if (data && data.length > 0) {
        setDbCategories(data);
      }
    }).catch(() => {});
    productMenuService.getGroups().then(setGroups).catch(() => {});
  }, []);

  const subcategoriesMap = React.useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) {
      return DEFAULT_SUBCATEGORIES_MAP;
    }

    const map: Record<string, Array<{ id: string; label: Record<string, string>; image: string; href: string }>> = {};
    groups.forEach((g) => {
      map[g.id] = [];
    });

    dbCategories.forEach((cat) => {
      const slug = (cat.slug || "").toLowerCase();
      const groupId = groupIdForCategory(cat.parentType, groups);
      if (!groupId) return;
      map[groupId].push({
        id: String(cat.id || slug),
        label: {
          zh: cat.nameZh || cat.name || cat.nameEn || slug,
          en: cat.nameEn || cat.name || slug,
          fr: cat.nameFr || cat.nameEn || cat.name || slug,
        },
        image: cat.imageUrl || "/categories/弯梁车/AP110 (2).png",
        href: `/products?category=${slug}`,
      });
    });

    return map;
  }, [dbCategories, groups]);

  // A group with nothing to show would be an empty panel, so it is left out of the sidebar.
  const visibleGroups = groups.filter((g) => (subcategoriesMap[g.id] ?? []).length > 0);
  const activeCategory = visibleGroups.some((g) => g.id === selectedGroup) ? selectedGroup : visibleGroups[0]?.id;
  const currentSubcategories = (activeCategory && subcategoriesMap[activeCategory]) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: ENTERPRISE_EASE }}
      className={cn(
        "absolute top-full left-0 right-0 bg-white shadow-2xl z-50 border-t border-zinc-100 select-none",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="menu"
      aria-label="Products directory"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="flex">
          {/* Left Category Sidebar */}
          <div className="w-[200px] py-3 pr-4 border-r border-zinc-100 shrink-0">
            <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase mb-1.5 block">
              {SIDEBAR_TITLES[locale] || SIDEBAR_TITLES.en}
            </span>
            <div className="space-y-0.5">
              {visibleGroups.map((category) => {
                const isActive = activeCategory === category.id;
                const displayLabel = groupLabel(category, locale);
                return (
                  <button
                    key={category.id}
                    onMouseEnter={() => setSelectedGroup(category.id)}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      isActive
                        ? "bg-brand-green/10 text-brand-green font-bold"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 font-medium"
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {category.image && isSafeImagePath(category.image) && (
                        <span className="relative h-5 w-8 shrink-0">
                          <Image src={category.image} alt="" fill sizes="32px" unoptimized className="object-contain" />
                        </span>
                      )}
                      <span className="truncate">{displayLabel}</span>
                    </span>
                    {isActive && <span className="text-brand-green font-bold ml-2">→</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Subcategories Grid */}
          <div className="flex-1 py-3 pl-6 grid grid-cols-5 gap-4 items-center">
            {currentSubcategories.map((sub) => {
              const displaySubLabel = sub.label[locale as keyof typeof sub.label] || sub.label.en;
              return (
                <Link
                  key={sub.id}
                  href={sub.href}
                  onClick={onClose}
                  className="group flex flex-col items-center justify-center p-2 rounded-xl border border-transparent hover:border-zinc-100 hover:bg-zinc-50/50 transition-all text-center cursor-pointer"
                >
                  <span className="text-[11px] font-bold text-zinc-500 tracking-wide group-hover:text-brand-green transition-colors block mb-2">
                    {displaySubLabel}
                  </span>

                  <div className="relative w-full h-[76px] flex items-center justify-center">
                    <Image
                      src={sub.image}
                      alt={displaySubLabel}
                      fill
                      unoptimized={sub.image.startsWith("/uploads") || sub.image.startsWith("http")}
                      sizes="120px"
                      className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_4px_6px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
