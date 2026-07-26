"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ProductModel } from "@/lib/types/products";
import { buildProductDetailUrl } from "@/lib/data/products";
import { ANIMATION_VARIANTS, PREMIUM_SPRING } from "@/lib/constants/animations";

interface ProductModelCardProps {
  product: ProductModel;
  className?: string;
}

interface ModelStyleConfig {
  containerClass: string;
  imageClass: string;
  hoverClass: string;
}

const DEFAULT_STYLE: ModelStyleConfig = {
  containerClass: "top-[48px] left-[-15%] right-[-15%]",
  imageClass: "",
  hoverClass: "group-hover:scale-[1.03] group-hover:translate-x-3",
};

// Per-model overrides for special positioning
const MODEL_STYLE_OVERRIDES: Record<string, Partial<ModelStyleConfig>> = {
  "AP110-A PLUS": {
    imageClass: "scale-[0.85] origin-bottom",
    hoverClass: "group-hover:scale-[0.88] group-hover:translate-x-3",
  },
};

// Per-category overrides
const CATEGORY_STYLE_OVERRIDES: Record<string, Partial<ModelStyleConfig>> = {
  tricycle: {
    containerClass: "top-[10px] left-[-40%] right-[-40%]",
  },
};

const getModelStyles = (modelName: string, category: string): ModelStyleConfig => {
  const modelOverride = MODEL_STYLE_OVERRIDES[modelName] || {};
  const categoryOverride = CATEGORY_STYLE_OVERRIDES[category] || {};
  return {
    containerClass:
      categoryOverride.containerClass ||
      modelOverride.containerClass ||
      DEFAULT_STYLE.containerClass,
    imageClass:
      modelOverride.imageClass ||
      categoryOverride.imageClass ||
      DEFAULT_STYLE.imageClass,
    hoverClass:
      modelOverride.hoverClass ||
      categoryOverride.hoverClass ||
      DEFAULT_STYLE.hoverClass,
  };
};

export const ProductModelCard: React.FC<ProductModelCardProps> = ({
  product,
  className,
}) => {
  const reduceMotion = useReducedMotion();
  const styles = getModelStyles(product.model, product.category);

  return (
    <div className="pb-8 h-full">
      <motion.div
        variants={ANIMATION_VARIANTS.fadeUp}
        className={className}
      >
        <Link
          href={buildProductDetailUrl(product.id, product.category)}
          className="group relative flex flex-col w-full outline-none focus-visible:ring-2 focus-visible:ring-[#1FA84F] focus-visible:ring-offset-4 rounded-[1.2rem]"
        >
          {/* Background Card — completely static */}
          <div className="relative aspect-[1.8/1] bg-[#F2F3F5] rounded-[1.2rem] p-5 overflow-visible">
            {/* Model label */}
            <div className="flex justify-between items-start w-full relative z-20 pointer-events-none">
              <span className="text-[16px] sm:text-[18px] font-bold text-gray-900 tracking-tight leading-tight group-hover:text-[#1FA84F] transition-colors duration-300">
                {product.model}
              </span>
            </div>

            {/* Motorcycle image — slides right on hover, returns on leave */}
            <div
              className={`absolute flex justify-center overflow-visible z-10 pointer-events-none bottom-[-15%] ${styles.containerClass}`}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  reduceMotion ? "" : styles.hoverClass
                } ${styles.imageClass}`}
              >
                <Image
                  src={product.image}
                  alt={product.model}
                  fill
                  className="object-contain object-bottom transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] filter drop-shadow-[0_12px_12px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] group-hover:brightness-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};
