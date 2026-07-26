"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ENTERPRISE_EASE,
  PREMIUM_SPRING,
  TILT_SPRING,
} from "@/lib/constants/animations";
import type { ProductAestheticContent } from "@/lib/data/product-detail";

interface ProductAestheticDesignProps {
  content: ProductAestheticContent;
  productId: string;
}

const ImageCard: React.FC<{
  src: string;
  alt: string;
  badgeSrc?: string;
  index: number;
  variants: any;
}> = ({ src, alt, badgeSrc, index, variants }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Pointer-tracking 3D tilt
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, TILT_SPRING);
  const rotateY = useSpring(rotateYRaw, TILT_SPRING);

  // Spotlight follow effect
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightBg = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(255, 255, 255, 0.12), transparent 50%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    
    // Normalise
    const normX = px / rect.width;
    const normY = py / rect.height;
    
    rotateYRaw.set((normX - 0.5) * 4);
    rotateXRaw.set((normY - 0.5) * -4);
    spotlightX.set(normX * 100);
    spotlightY.set(normY * 100);
  };

  const handlePointerLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="group relative w-full overflow-hidden rounded-2xl bg-zinc-900/40 shadow-2xl transition-all duration-500"
    >
      {/* Interactive Spotlight Overlay */}
      <motion.div
        aria-hidden
        style={{ background: spotlightBg }}
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Shadow overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

      {/* Main Image - Full view block image with responsive auto height */}
      <div className="relative w-full h-auto block z-0">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={625}
          className="w-full h-auto block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
          sizes="(max-width: 1024px) 100vw, 85vw"
          priority={index === 0}
        />
      </div>

      {/* Badge/Logo Overlay - Slides in from the right edge inside the card */}
      {badgeSrc && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.85, ease: ENTERPRISE_EASE, delay: 0.3 }}
          className="absolute right-4 bottom-4 z-20 w-32 sm:right-6 sm:bottom-6 sm:w-44 lg:right-8 lg:bottom-8 lg:w-56"
        >
          <Image
            src={badgeSrc}
            alt="APSONIC logo badge"
            width={224}
            height={74}
            className="h-auto w-full select-none"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export const ProductAestheticDesign: React.FC<ProductAestheticDesignProps> = ({
  content,
}) => {
  const {
    title,
    subtitle,
    subtitleHighlight,
    backgroundImage,
    firstImage,
    secondImage,
    badgeImage,
  } = content;

  const t = useTranslations("productDetail");
  const reduceMotion = useReducedMotion();

  // Localized title & subtitle variables using shared, robust non-nested keys
  const localTitle = t("aesthetic.title", { defaultMessage: title });
  const localSubtitle = t("aesthetic.subtitle", { defaultMessage: subtitle });
  const localHighlight = t("aesthetic.subtitleHighlight", { defaultMessage: subtitleHighlight });

  // Split subtitle into highlight segments
  const hasHighlight = localSubtitle.includes(localHighlight);
  const parts = hasHighlight ? localSubtitle.split(localHighlight) : [localSubtitle];

  // Custom animation variants for left and right entries
  const slideInFromLeft = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : -80 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.85, ease: ENTERPRISE_EASE },
    },
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : 80 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.85, ease: ENTERPRISE_EASE },
    },
  };

  return (
    <section className="isolate relative z-0 w-full overflow-hidden bg-zinc-950 py-20 sm:py-28 select-none">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover opacity-80"
          sizes="100vw"
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Title & Subtitle */}
        <div className="mb-14 flex flex-col items-center text-center sm:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: ENTERPRISE_EASE }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase"
          >
            {localTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: ENTERPRISE_EASE, delay: 0.12 }}
            className="mt-4 text-xs sm:text-sm lg:text-base font-semibold tracking-wider text-zinc-400 uppercase"
          >
            {hasHighlight ? (
              <>
                {parts[0]}
                <span className="text-[#1FA84F] font-bold">
                  {localHighlight}
                </span>
                {parts[1]}
              </>
            ) : (
              localSubtitle
            )}
          </motion.p>
        </div>

        {/* Stacked Images Cards */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
          {/* Marketplace image card (slides from left) */}
          <ImageCard
            src={firstImage}
            alt="Marketplace setting"
            index={0}
            variants={slideInFromLeft}
          />

          {/* Savannah image card (slides from right) */}
          <ImageCard
            src={secondImage}
            alt="Savannah setting"
            badgeSrc={badgeImage}
            index={1}
            variants={slideInFromRight}
          />
        </div>
      </div>
    </section>
  );
};
