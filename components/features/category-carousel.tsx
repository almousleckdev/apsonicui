"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { DEFAULT_CATEGORIES } from "@/lib/data/featured-models";
import { PREMIUM_SPRING } from "@/lib/constants/animations";
import { homepageService } from "@/services/homepage-service";
import { cn } from "@/lib/utils";
import { HomeCategoryItem } from "@/lib/types/homepage";

interface CategoryCarouselProps {
  className?: string;
  initialConfig?: HomeCategoryItem[];
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ className, initialConfig }) => {
  const locale = useLocale();
  const categories = initialConfig && initialConfig.length > 0 ? initialConfig : DEFAULT_CATEGORIES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, categories.length - itemsPerView);
  const clampedIndex = Math.min(currentIndex, maxIndex);

  const scrollLeft = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const scrollRight = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const canScrollLeft = clampedIndex > 0;
  const canScrollRight = clampedIndex < maxIndex;

  const getLocalizedName = (cat: any) => {
    if (locale === "zh") {
      if (cat.nameZh) return cat.nameZh;
      const mapping: Record<string, string> = {
        standard: "骑士车",
        street: "街车",
        offroad: "越野车",
        underbone: "弯梁车",
        scooter: "踏板车",
        atv: "ATV",
        tricycle: "三轮车",
      };
      return mapping[cat.id] || cat.name;
    }
    if (locale === "fr" && cat.nameFr) return cat.nameFr;
    return cat.name;
  };

  return (
    <section className={cn("w-full py-20 bg-white border-b border-zinc-100/50", className)}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-extrabold text-xs uppercase tracking-[0.25em] text-brand-green">
            {locale === "zh" ? "产品分类" : "Product Lineup"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-zinc-950">
            {locale === "zh" ? "探索全系车型" : "Explore Our Categories"}
          </h2>
        </div>

        {/* Carousel Sliders */}
        <div className="relative w-full max-w-[1160px] mx-auto flex items-center justify-center px-2 sm:px-10">
          
          {/* Left button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-0 z-20 w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 shadow-sm",
              canScrollLeft
                ? "bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-zinc-100 border-zinc-200 text-zinc-300 cursor-not-allowed"
            )}
            aria-label="Previous Category"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Sliding container */}
          <div className="w-full overflow-hidden py-4 px-2">
            <motion.div
              className="flex"
              animate={{ x: `-${clampedIndex * (100 / itemsPerView)}%` }}
              transition={{ type: "spring", stiffness: 220, damping: 26, mass: 1 }}
            >
              {categories.map((category, index) => {
                return (
                  <div
                    key={category.id}
                    style={{ width: `${100 / itemsPerView}%` }}
                    className="flex-shrink-0 px-4"
                  >
                    <Link
                      href={category.href}
                      className="group block relative w-full overflow-hidden cursor-pointer outline-none rounded-xl"
                    >
                      <motion.div
                        whileHover={{ y: -6 }}
                        whileTap={{ scale: 0.98 }}
                        transition={PREMIUM_SPRING}
                        className="flex flex-col items-center"
                      >
                        {/* Image container on clean normal white background */}
                        <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            priority={index < 3}
                            loading={index < 3 ? "eager" : "lazy"}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                            className="object-contain p-2 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                          />
                        </div>

                        {/* Category Name below the image */}
                        <div className="mt-4 flex flex-col items-center">
                          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 group-hover:text-brand-green transition-colors duration-300">
                            {getLocalizedName(category)}
                          </h3>
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-0 z-20 w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 shadow-sm",
              canScrollRight
                ? "bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-zinc-100 border-zinc-200 text-zinc-300 cursor-not-allowed"
            )}
            aria-label="Next Category"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Indicator dots */}
        {categories.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer outline-none",
                  i === clampedIndex
                    ? "bg-brand-green w-5"
                    : "bg-zinc-300 hover:bg-zinc-400"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
