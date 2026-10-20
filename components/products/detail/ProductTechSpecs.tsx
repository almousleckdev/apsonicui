"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ENTERPRISE_EASE } from "@/lib/constants/animations";
import type { ProductTechSpecsContent } from "@/lib/data/product-detail";
import { cn } from "@/lib/utils";

interface ProductTechSpecsProps {
  content: ProductTechSpecsContent;
}

export const ProductTechSpecs: React.FC<ProductTechSpecsProps> = ({
  content,
}) => {
  const { keySpecs = [], fullSpecs = [] } = content;
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const [, startTransition] = useTransition();
  const t = useTranslations("productDetail");

  const getTranslatedLabel = (rawLabel: string) => {
    return rawLabel;
  };

  // Split full specs into 2 columns for large screens
  const leftSpecs = fullSpecs.filter((_, i) => i % 2 === 0);
  const rightSpecs = fullSpecs.filter((_, i) => i % 2 !== 0);

  return (
    <section className="relative w-full bg-[#F5F6F7] py-20 sm:py-24 select-none border-t border-zinc-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ENTERPRISE_EASE }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-800 uppercase mb-16"
        >
          {t("techSpecsTitle", { defaultMessage: "Technical Specs" })}
        </motion.h2>

        {/* Top Key Metrics Row */}
        {keySpecs.length > 0 && (
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0 mb-14 text-center items-stretch divide-x-0 sm:divide-x divide-zinc-200/80">
            {keySpecs.map((spec, i) => (
              <motion.div
                key={`keyspec-${spec.label}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: ENTERPRISE_EASE, delay: i * 0.08 }}
                className="flex flex-col items-center justify-between px-4"
              >
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-zinc-500 mb-4 h-8 flex items-center justify-center">
                  {getTranslatedLabel(spec.label)}
                </span>
                <div className="flex items-baseline justify-center">
                  {spec.prefix && (
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 mr-0.5 select-none font-mono">
                      {spec.prefix}
                    </span>
                  )}
                  <AnimatedCounter
                    to={spec.value}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight"
                  />
                </div>
                <span className="text-xs font-bold text-zinc-400 mt-2 select-none">
                  {spec.unit}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Expand/Collapse Button */}
        {fullSpecs.length > 0 && (
          <div className="flex justify-center mb-10">
            <motion.button
              type="button"
              onClick={() => startTransition(() => setIsOpen(!isOpen))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-8 py-3 text-xs sm:text-sm font-bold text-zinc-700 shadow-sm transition-all duration-300 hover:bg-zinc-50 hover:border-zinc-400 outline-none"
            >
              {isOpen 
                ? t("hideParameters", { defaultMessage: "Hide parameters" })
                : t("fullParameters", { defaultMessage: "Full parameters" })
              }
            </motion.button>
          </div>
        )}

        {/* Collapsible Tech Spec Table */}
        <AnimatePresence initial={false}>
          {isOpen && fullSpecs.length > 0 && (
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: ENTERPRISE_EASE }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-6 pb-6 text-left">
                {/* Column 1 (Even rows) */}
                <div className="flex flex-col border-b md:border-b-0 border-zinc-200">
                  {leftSpecs.map((spec, i) => (
                    <div
                      key={`left-${spec.label}-${i}`}
                      className={cn(
                        "flex border-t border-x border-zinc-200 min-h-[46px]",
                        i === leftSpecs.length - 1 && "border-b"
                      )}
                    >
                      {/* Label header cell */}
                      <div className="w-[45%] sm:w-[40%] bg-zinc-200/80 px-4 py-3 flex items-center justify-start text-[10px] sm:text-xs font-black uppercase tracking-wider text-zinc-700 border-r border-zinc-200 shrink-0">
                        {getTranslatedLabel(spec.label)}
                      </div>
                      {/* Value cell */}
                      <div className="flex-1 bg-white px-4 py-3 flex items-center justify-start text-xs sm:text-sm font-semibold text-zinc-600">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column 2 (Odd rows) */}
                <div className="flex flex-col mt-4 md:mt-0">
                  {rightSpecs.map((spec, i) => (
                    <div
                      key={`right-${spec.label}-${i}`}
                      className={cn(
                        "flex border-t border-x border-zinc-200 min-h-[46px]",
                        i === rightSpecs.length - 1 && "border-b border-zinc-200"
                      )}
                    >
                      {/* Label header cell */}
                      <div className="w-[45%] sm:w-[40%] bg-zinc-200/80 px-4 py-3 flex items-center justify-start text-[10px] sm:text-xs font-black uppercase tracking-wider text-zinc-700 border-r border-zinc-200 shrink-0">
                        {getTranslatedLabel(spec.label)}
                      </div>
                      {/* Value cell */}
                      <div className="flex-1 bg-white px-4 py-3 flex items-center justify-start text-xs sm:text-sm font-semibold text-zinc-600">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
