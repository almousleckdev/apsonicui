"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useCarousel } from "@/hooks/useCarousel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ENTERPRISE_EASE, PREMIUM_SPRING } from "@/lib/constants/animations";
import { CAROUSEL_CONFIG } from "@/lib/constants";
import type { ProductStorySplitContent } from "@/lib/data/product-detail";

interface ProductStorySplitProps {
  content: ProductStorySplitContent;
  productId: string;
}

export const ProductStorySplit: React.FC<ProductStorySplitProps> = ({
  content,
}) => {
  const { title, description, background, variants } = content;
  const reduceMotion = useReducedMotion();
  const t = useTranslations("productDetail");

  const {
    currentIndex,
    isPaused,
    goToSlide,
    nextSlide,
    prevSlide,
    pause,
    resume,
  } = useCarousel({
    itemsCount: variants.length,
    autoPlay: true,
    interval: CAROUSEL_CONFIG.defaultInterval,
  });

  const current = variants[currentIndex];
  const next = variants[(currentIndex + 1) % variants.length];
  const canSwipe = variants.length > 1;

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 80;
    if (info.offset.x < -threshold) nextSlide();
    else if (info.offset.x > threshold) prevSlide();
    resume();
  };

  // Localized variables using shared, robust non-nested keys
  const localTitle = t("storySplit.title", { defaultMessage: title });
  const localDescription = t("storySplit.description", { defaultMessage: description });

  return (
    <section
      className="isolate relative z-0 w-full overflow-hidden bg-white py-20 sm:py-28"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
        className="pointer-events-none absolute bottom-0 left-0 w-95 select-none sm:w-130"
      >
        <Image 
          src={background} 
          alt="" 
          width={380}
          height={380}
          priority={false} 
        />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={localTitle} description={localDescription} align="center" light />
      </div>

      <div className="relative mt-4 h-70 w-full sm:h-100 lg:h-120">
        {/* Next variant peeking in from the right edge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full max-w-2xl translate-x-[55%] opacity-25 sm:translate-x-[50%]">
          <Image
            src={next.image}
            alt=""
            fill
            className="object-contain"
            sizes="60vw"
          />
        </div>

        {/* Active variant - draggable on touch/mouse to swipe between colors */}
        <motion.div
          className="relative z-10 mx-auto h-full w-full max-w-2xl"
          drag={canSwipe ? "x" : false}
          dragElastic={0.15}
          dragConstraints={{ left: 0, right: 0 }}
          onPointerDown={pause}
          onDragEnd={handleDragEnd}
          style={{ cursor: canSwipe ? "grab" : undefined }}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, x: 160 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -160 }}
              transition={{ duration: 0.7, ease: ENTERPRISE_EASE }}
              className="absolute inset-0"
            >
              {/* Slow continuous zoom for a cinematic "living photo" feel */}
              <motion.div
                className="absolute inset-0"
                animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
                transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
              >
                <Image
                  src={current.image}
                  alt={`APSONIC Product Detail Variant - ${current.colorLabel}`}
                  fill
                  priority
                  className="pointer-events-none object-contain"
                  sizes="(max-width: 640px) 100vw, 60vw"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Color-swatch indicator pills */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-3">
        {variants.map((variant, i) => {
          const isActive = i === currentIndex;
          return (
            <button
              key={variant.id}
              type="button"
              aria-label={`Show ${variant.colorLabel} color`}
              aria-current={isActive}
              onClick={() => goToSlide(i)}
              className="p-1.5 cursor-pointer outline-none"
            >
              <motion.span
                layout
                animate={{ width: isActive ? 36 : 10 }}
                transition={PREMIUM_SPRING}
                className="block h-2.5 overflow-hidden rounded-full bg-black/10"
              >
                {isActive ? (
                  <motion.span
                    key={`${currentIndex}-${isPaused}`}
                    initial={{ width: "0%" }}
                    animate={{ width: isPaused ? "0%" : "100%" }}
                    transition={
                      isPaused
                        ? { duration: 0.2 }
                        : {
                            duration: CAROUSEL_CONFIG.defaultInterval / 1000,
                            ease: "linear",
                          }
                    }
                    className="block h-full rounded-full"
                    style={{ backgroundColor: variant.dotColor }}
                  />
                ) : (
                  <span
                    className="block h-full w-full rounded-full"
                    style={{ backgroundColor: variant.dotColor }}
                  />
                )}
              </motion.span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
