"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { RevealText } from "@/components/ui/RevealText";
import { ENTERPRISE_EASE, PREMIUM_SPRING } from "@/lib/constants/animations";
import { cn } from "@/lib/utils";
import type { SpecBannerContent } from "@/lib/data/product-detail";

interface ProductSpecBannerProps {
  content: SpecBannerContent;
  productId: string;
  index?: number;
}

export const ProductSpecBanner: React.FC<ProductSpecBannerProps> = ({
  content,
  index = 0,
}) => {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("productDetail");
  const { id, background, align, titleLines, description, metric, featureCards, badge } =
    content;
  const isRight = align === "right";
  const slideFrom = isRight ? 48 : -48;

  if (index === 0 || index === 1 || index === 2 || content?.imageUrl) {
    let imgSrc = content?.imageUrl || content?.background || "";
    const imgWidth = 2000;
    let imgHeight = 1028;
    let imgAlt = content?.titleLines?.join(" ") || "APSONIC Specification";

    if (!imgSrc) {
      if (index === 0) {
        imgSrc = "/products/details/thirdsection.jpg";
        imgHeight = 1028;
        imgAlt = "APSONIC Frame Specification";
      } else if (index === 1) {
        imgSrc = "/products/details/fourthsection.jpg";
        imgHeight = 1033;
        imgAlt = "APSONIC Rear Carrier Specification";
      } else {
        imgSrc = "/products/details/fivessection.jpg";
        imgHeight = 1032;
        imgAlt = "APSONIC Engine Specification";
      }
    }

    return (
      <section className="isolate relative z-0 overflow-hidden bg-zinc-950 select-none border-t border-zinc-900 w-full">
        {/* Full bleed graphic showing specification values with fade-up entrance */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-auto block"
        >
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={imgWidth}
            height={imgHeight}
            priority={false}
            className="w-full h-auto block object-contain"
            sizes="100vw"
          />
        </motion.div>
      </section>
    );
  }

  // Localized variables using shared, robust non-nested keys
  const localTitleLines = titleLines.map((line, lineIdx) =>
    t(`specBanners.${id}.titleLine${lineIdx + 1}`, { defaultMessage: line })
  );
  const localDescription = t(`specBanners.${id}.description`, { defaultMessage: description });
  const localMetricLabel = metric
    ? t(`specBanners.${id}.metricLabel`, { defaultMessage: metric.label })
    : undefined;

  return (
    <section
      className="isolate relative z-0 w-full overflow-hidden bg-zinc-950 flex items-center min-h-[300px] sm:min-h-[400px] lg:min-h-[560px]"
      style={{ aspectRatio: "2000 / 1126" }}
    >
      {/* Background Image with subtle continuous zoom */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
      >
        <Image
          src={background}
          alt=""
          fill
          priority={false}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Scrim Overlay */}
      <div className={cn(
        "absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/35 to-black/20",
        isRight 
          ? "bg-gradient-to-l from-black/85 via-black/40 to-transparent"
          : "bg-gradient-to-r from-black/85 via-black/40 to-transparent"
      )} />

      {/* Content Block */}
      <div
        className={cn(
          "absolute inset-y-0 z-20 flex w-full max-w-lg flex-col justify-start pt-10 sm:pt-14 lg:pt-20 pb-10 sm:pb-14 lg:pb-20 gap-3 px-6 sm:gap-4 sm:px-10 lg:px-16",
          isRight
            ? "right-0 items-end text-right"
            : "left-0 items-start text-left",
        )}
      >
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white uppercase">
          {localTitleLines.map((line) => (
            <RevealText
              key={line}
              text={line}
              as="span"
              className="block"
              justify={isRight ? "end" : "start"}
            />
          ))}
        </h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, x: slideFrom }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: ENTERPRISE_EASE, delay: 0.1 }}
          className="max-w-sm text-xs sm:text-sm lg:text-base text-white/85 leading-relaxed font-semibold"
        >
          {localDescription}
        </motion.p>

        {metric && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: ENTERPRISE_EASE, delay: 0.25 }}
            className="mt-auto"
          >
            <p className="text-xs sm:text-sm text-white/70 font-semibold mb-1">
              {localMetricLabel}
            </p>
            <div className={cn("flex items-end gap-0.5", isRight ? "justify-end" : "justify-start")}>
              <AnimatedCounter
                to={metric.value}
                className={cn(
                  "text-4xl sm:text-5xl lg:text-6xl font-black leading-none tracking-tight font-mono",
                  id === "frame" ? "text-white" : "text-[#8DE029]"
                )}
              />
              <span className={cn(
                "mb-0.5 text-xl sm:text-2xl lg:text-3xl font-extrabold leading-none",
                id === "frame" ? "text-white" : "text-[#8DE029]"
              )}>
                {metric.unit}
              </span>
            </div>
          </motion.div>
        )}

        {featureCards && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: ENTERPRISE_EASE, delay: 0.25 }}
            className="mt-2 flex gap-2 sm:gap-3"
          >
            {featureCards.map((card, i) => (
              <motion.div
                key={i}
                whileHover={reduceMotion ? {} : { y: -5, scale: 1.04 }}
                transition={PREMIUM_SPRING}
                className="relative h-16 w-20 sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg cursor-pointer"
              >
                <Image
                  src={card.image}
                  alt={card.label ?? ""}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                {card.label && (
                  <div className="absolute inset-0 flex flex-col justify-between p-2 z-10 bg-black/10">
                    <span className="text-left text-[9px] font-bold uppercase tracking-wider leading-tight text-white/90 sm:text-xs">
                      {card.label}
                    </span>
                    <span className="text-left text-base font-black leading-none text-white sm:text-lg">
                      {card.multiplier}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {badge && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20, rotate: -8 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={reduceMotion ? {} : { scale: 1.05, rotate: -2 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...PREMIUM_SPRING, delay: 0.4 }}
            className="mt-2 w-24 sm:w-32 lg:w-40"
          >
            <Image 
              src={badge} 
              alt="APSONIC Badge" 
              width={160}
              height={160}
              className="h-auto w-full filter brightness-0 invert drop-shadow-md" 
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};
