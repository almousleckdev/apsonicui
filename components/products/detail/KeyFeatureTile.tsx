"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  ANIMATION_VARIANTS,
  ENTERPRISE_EASE,
  PREMIUM_SPRING,
  TILT_SPRING,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils";
import type { KeyFeatureItem } from "@/lib/data/product-detail";

interface KeyFeatureTileProps {
  item: KeyFeatureItem;
  index?: number;
  className?: string;
}

const CountUp: React.FC<{ to: number; className?: string }> = ({
  to,
  className,
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const node = nodeRef.current;
      node.textContent = "0";
      const controls = animate(0, to, {
        duration: 1.4,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = Math.floor(value).toString();
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return (
    <span ref={nodeRef} className={className}>
      0
    </span>
  );
};

type Align = "left" | "right";

export const KeyFeatureTile: React.FC<KeyFeatureTileProps> = ({
  item,
  index = 0,
  className,
}) => {
  const reduceMotion = useReducedMotion();
  const { title, image, tall, layout, label, metric, text, highlight } = item;

  // Pointer-tracking 3D tilt + spotlight glow
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, TILT_SPRING);
  const rotateY = useSpring(rotateYRaw, TILT_SPRING);
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(255,255,255,0.06), transparent 60%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateYRaw.set((px - 0.5) * 5);
    rotateXRaw.set((py - 0.5) * -5);
    spotlightX.set(px * 100);
    spotlightY.set(py * 100);
  };

  const handlePointerLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  const titleLower = title.toLowerCase();
  const isEngine = titleLower === "engine";
  const isFrame = titleLower === "frame";
  const isHeadlights = titleLower === "headlights";
  const isAbsorber = titleLower.includes("absorber");
  const isPedal = titleLower === "pedal";

  const renderMetric = (size: "lg" | "md", align: Align = "left") => (
    <div
      className={cn(
        "flex items-baseline select-none leading-none",
        align === "right" && "justify-end",
      )}
    >
      <CountUp
        to={metric!.value}
        className={cn(
          "font-black leading-none text-[#8DE029] tracking-tight font-mono",
          size === "lg" ? "text-6xl sm:text-7xl lg:text-[80px]" : "text-4xl sm:text-5xl lg:text-6xl",
        )}
      />
      <span
        className={cn(
          "font-extrabold leading-none text-[#8DE029] ml-0.5",
          size === "lg" ? "text-2xl sm:text-3xl lg:text-[34px]" : "text-lg sm:text-xl lg:text-2xl",
        )}
      >
        {metric!.unit}
      </span>
      {metric!.suffix && (
        <span className="ml-1 text-lg font-bold leading-none text-[#8DE029] sm:text-xl lg:text-2xl select-none">
          {metric!.suffix}
        </span>
      )}
    </div>
  );

  const renderValueBlock = (size: "lg" | "md", align: Align = "left") => {
    if (metric) return renderMetric(size, align);
    if (text) {
      return (
        <span
          className={cn(
            "block text-2xl font-black text-[#8DE029] sm:text-3xl lg:text-4xl uppercase tracking-wider",
            align === "right" && "text-right",
          )}
        >
          {text}
        </span>
      );
    }
    if (highlight) {
      return (
        <div className={cn("leading-tight", align === "right" && "text-right")}>
          {highlight.lines.map((line) => (
            <p key={line} className="text-xl font-extrabold text-[#8DE029] sm:text-2xl lg:text-3xl uppercase leading-none pb-1">
              {line}
            </p>
          ))}
          <p className="mt-1 text-xs text-white/90 font-semibold sm:text-sm uppercase tracking-wide">
            {highlight.trail}
          </p>
        </div>
      );
    }
    return null;
  };

  const bottomAlign: Align = layout === "bottom-right" ? "right" : "left";

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeUp}
      whileHover={reduceMotion ? {} : { y: -5, transition: PREMIUM_SPRING }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.08 },
        y: { ...PREMIUM_SPRING, delay: index * 0.08 },
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black transition-colors duration-500 hover:border-[#8DE029]/30 min-h-[190px]",
        tall ? "aspect-auto sm:aspect-[467/635] sm:min-h-[420px]" : "aspect-[1.58 / 1]",
        className,
      )}
    >
      {/* Spotlight overlay */}
      <motion.div
        aria-hidden
        style={{ background: spotlightBackground }}
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Floating Product Image - Sized via padding offsets and zoomed in massively for bold visual presence */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: ENTERPRISE_EASE, delay: index * 0.07 + 0.12 }}
        className="absolute inset-0 z-0 select-none pointer-events-none"
      >
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt={title}
            fill
            className={cn(
              "object-contain",
              isEngine && "object-bottom p-0 pt-16 sm:pt-20 scale-[1.38] drop-shadow-[0_0_24px_rgba(59,130,246,0.65)] filter",
              isFrame && "object-right-bottom p-0 pl-16 sm:pl-24 pt-6 sm:pt-10 scale-[1.48]",
              isHeadlights && "object-right-bottom p-0 pl-16 sm:pl-24 pt-4 sm:pt-8 scale-[1.48]",
              isAbsorber && "object-left-bottom p-0 pr-16 sm:pr-24 pt-6 sm:pt-8 pb-0 scale-[1.52]",
              isPedal && "object-right-bottom p-0 pl-16 sm:pl-24 pt-6 sm:pt-8 scale-[1.55]"
            )}
            sizes={tall ? "(max-width: 640px) 100vw, 35vw" : "(max-width: 640px) 100vw, 25vw"}
          />
        </div>
      </motion.div>

      {/* Grid Content Scrims */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent z-10" />

      {/* Card Content overlays */}
      <div className="relative z-20 flex h-full flex-col p-5 sm:p-6 justify-between">
        {/* Wrap title and below-title value block in a single container so they stay grouped at the top */}
        <div className="flex flex-col gap-1 w-full items-start">
          <div className="flex items-start justify-between gap-3 w-full">
            <span className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
              {title}
            </span>
            {layout === "inline-top" && (
              <div className="text-right">
                {label && (
                  <p className="mb-1 text-[10px] text-white/80 font-bold uppercase sm:text-xs tracking-wide">
                    {label}
                  </p>
                )}
                {metric && renderMetric("md", "right")}
              </div>
            )}
          </div>

          {/* Below title layout - Pinned to the top right below the header title */}
          {layout === "below" && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: ENTERPRISE_EASE, delay: index * 0.08 + 0.22 }}
              className="mt-1 w-full"
            >
              {renderValueBlock(tall ? "lg" : "md")}
            </motion.div>
          )}
        </div>

        {/* Bottom pinned layout */}
        {(layout === "bottom-left" || layout === "bottom-right") && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: ENTERPRISE_EASE, delay: index * 0.08 + 0.22 }}
            className={cn(
              "mt-auto flex w-full",
              bottomAlign === "right" ? "justify-end" : "justify-start",
            )}
          >
            {renderValueBlock("md", bottomAlign)}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
