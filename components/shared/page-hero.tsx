"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle: string;
  highlight?: string;
  bgImage: string;
  isFullHeight?: boolean;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  highlight,
  bgImage,
  isFullHeight = false,
}) => {
  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-zinc-950",
        isFullHeight ? "h-screen w-full" : "h-[55vh] min-h-[480px]"
      )}
    >
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover opacity-20 grayscale brightness-75 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950" />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 h-1 w-12 rounded bg-brand-green" />

          <h1 className="mb-6 text-4xl sm:text-7xl font-black tracking-tight text-white uppercase drop-shadow-2xl">
            {title} <br />
            {highlight && (
              <span className="text-zinc-400 font-bold text-3xl sm:text-5xl tracking-normal normal-case block mt-2">
                {highlight}
              </span>
            )}
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-300 font-medium leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
