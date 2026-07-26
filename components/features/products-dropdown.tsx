"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ENTERPRISE_EASE } from "@/lib/constants/animations";
import { cn } from "@/lib/utils";

interface ProductsDropdownProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  onClose?: () => void;
}

export const ProductsDropdown: React.FC<ProductsDropdownProps> = ({
  onMouseEnter,
  onMouseLeave,
  className,
  onClose,
}) => {
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>("two-wheeler");

  // Multilingual sidebar titles
  const sidebarTitles: Record<string, string> = {
    zh: "车型类别",
    en: "VEHICLE CATEGORIES",
    fr: "CATÉGORIES DE VÉHICULES",
  };

  const categoriesList = [
    {
      id: "two-wheeler",
      label: { zh: "两轮车", en: "Two-wheeler", fr: "Deux-roues" },
    },
    {
      id: "three-wheeler",
      label: { zh: "三轮车", en: "Three-wheeler", fr: "Trois-roues" },
    },
    {
      id: "atv",
      label: { zh: "全地形", en: "All-Terrain (ATV)", fr: "Tout-terrain (ATV)" },
    },
  ];

  const subcategoriesMap: Record<
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
        id: "offroad",
        label: { zh: "越野车", en: "Off-Road", fr: "Tout-Terrain" },
        image: "/products/AP250GY (1).png",
        href: "/products?category=offroad",
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
        image: "/categories/踏板车/AP125T/AP125T 右侧 精修 白（2）.png",
        href: "/products?category=scooter",
      },
    ],
    "three-wheeler": [
      {
        id: "passenger",
        label: { zh: "载人三轮车", en: "Passenger Tricycle", fr: "Tricycle Passager" },
        image: "/categories/三轮车/特殊/AP150ZK (1).png",
        href: "/products?category=tricycle&search=ZK",
      },
      {
        id: "cargo",
        label: { zh: "载货三轮车", en: "Cargo Tricycle", fr: "Tricycle Cargo" },
        image: "/categories/三轮车/AP150ZH-175 更新/AP150ZH-175 MAX (1).png",
        href: "/products?category=tricycle&search=ZH",
      },
    ],
    atv: [
      {
        id: "atv-sub",
        label: { zh: "全地形", en: "ATV", fr: "ATV" },
        image: "/categories/ATV/AP150ST-250 正右侧 投影.png",
        href: "/products?category=atv",
      },
    ],
  };

  const currentSubcategories = subcategoriesMap[activeCategory] || [];

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
          
          {/* Left Category Sidebar (Super Compact Height) */}
          <div className="w-[200px] py-3 pr-4 border-r border-zinc-100 shrink-0">
            <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase mb-1.5 block">
              {sidebarTitles[locale] || sidebarTitles.en}
            </span>
            <div className="space-y-0.5">
              {categoriesList.map((category) => {
                const isActive = activeCategory === category.id;
                const displayLabel = category.label[locale as keyof typeof category.label] || category.label.en;
                return (
                  <button
                    key={category.id}
                    onMouseEnter={() => setActiveCategory(category.id)}
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
                    <span>{displayLabel}</span>
                    {isActive && <span className="text-brand-green font-bold ml-2">→</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Subcategories Grid (Super Flat Layout) */}
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
                  
                  {/* Uniform Aspect-ratio Container for Equal Sized Images */}
                  <div className="relative w-full h-[76px] flex items-center justify-center">
                    <Image
                      src={sub.image}
                      alt={displaySubLabel}
                      fill
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
