"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ENTERPRISE_EASE } from "@/lib/constants/animations";
import { cn } from "@/lib/utils";
import type { ProductTechSpecsContent } from "@/lib/data/product-detail";

interface ProductTechSpecsProps {
  content: ProductTechSpecsContent;
}

const SPEC_TRANSLATION_KEYS: Record<string, string> = {
  "DISPLACEMENT(ML)": "specs.displacement",
  "Wheelbase(MM)": "specs.wheelbase",
  "BORE(MM)XSTROKE(MM)": "specs.boreStroke",
  "L(MM)XW(MM)XH(MM)": "specs.dimensions",
  "COMPRESSION RATIO": "specs.compressionRatio",
  "MIN GROUND CLEARANCE(MM)": "specs.minGroundClearance",
  "MAX POWER(KW/RPM)": "specs.maxPower",
  "N.W(KG)": "specs.weight",
  "MAX TORQUE(N.m/RPM)": "specs.maxTorque",
  "BRAKE": "specs.brake",
  "MAX SPEED(KM/H)": "specs.maxSpeed",
  "TYRE SIZE": "specs.tyreSize",
  "IGNITION": "specs.ignition",
  "FUEL TANK CAPACITY(L)": "specs.fuelTankCapacity",
  "STARTER": "specs.starter",
  "CLUTCH TYPE": "specs.clutchType",
};

const KEY_SPEC_MAPPER: Record<string, string> = {
  "MAX SPEED": "specs.maxSpeed",
  "FUEL TANK CAPACITY": "specs.fuelTankCapacity",
  "N.W": "specs.weight",
  "GROUND CLEARANCE": "specs.minGroundClearance",
};

export const ProductTechSpecs: React.FC<ProductTechSpecsProps> = ({
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const t = useTranslations("productDetail");
  const { keySpecs, fullSpecs } = content;

  // Split specs into pairs of { leftSpec, rightSpec } for the 2-column table grid
  const leftSpecs = fullSpecs.filter((_, i) => i % 2 === 0);
  const rightSpecs = fullSpecs.filter((_, i) => i % 2 !== 0);

  const getTranslatedLabel = (label: string): string => {
    // Check if it's one of the known labels
    const specKey = SPEC_TRANSLATION_KEYS[label];
    if (specKey) return t(specKey);

    const keySpecKey = KEY_SPEC_MAPPER[label];
    if (keySpecKey) return t(keySpecKey);

    return label;
  };

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
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0 mb-14 text-center items-stretch divide-x-0 sm:divide-x divide-zinc-200/80">
          {keySpecs.map((spec, i) => (
            <motion.div
              key={spec.label}
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

        {/* Expand/Collapse Button */}
        <div className="flex justify-center mb-10">
          <motion.button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
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

        {/* Collapsible Tech Spec Table */}
        <AnimatePresence initial={false}>
          {isOpen && (
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
                      key={spec.label}
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
                      key={spec.label}
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
