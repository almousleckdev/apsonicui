"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string | React.ReactNode;
  title: string | React.ReactNode;
  description?: string;
  highlightWord?: string;
  className?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  description,
  highlightWord,
  className,
  align = "center",
  light = false,
}) => {
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  const renderTitle = () => {
    if (typeof title !== "string") return title;

    if (highlightWord && title.includes(highlightWord)) {
      const parts = title.split(highlightWord);
      return (
        <>
          {parts[0]}
          <span className="text-[#1FA84F]">{highlightWord}</span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <div
      className={cn(
        "flex flex-col mb-12 md:mb-16",
        alignmentClasses[align],
        className,
      )}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={cn(
            "font-extrabold text-xs uppercase tracking-[0.25em] mb-4",
            light ? "text-[#1FA84F]" : "text-[#1FA84F]/90",
          )}
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase",
          light ? "text-zinc-950" : "text-white",
        )}
      >
        {renderTitle()}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={cn(
            "mt-5 text-sm sm:text-base max-w-2xl leading-relaxed font-semibold",
            light ? "text-zinc-500" : "text-zinc-400",
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
