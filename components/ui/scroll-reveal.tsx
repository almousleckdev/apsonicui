"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ENTERPRISE_EASE, ANIMATION_VARIANTS } from "@/lib/constants/animations";

export type ScrollRevealVariant =
  | "fadeUp"
  | "fadeIn"
  | "scaleIn"
  | "slideLeft"
  | "slideRight";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.02,
}) => {
  const reduceMotion = useReducedMotion();
  const variants = ANIMATION_VARIANTS[variant];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -30px 0px" }}
      variants={reduceMotion ? { hidden: {}, show: {} } : variants}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: ENTERPRISE_EASE,
      }}
    >
      {children}
    </motion.div>
  );
};
