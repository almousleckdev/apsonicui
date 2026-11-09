"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount, margin: "0px 0px -30px 0px" });

  // The content is part of the server HTML and must be visible without waiting for any script. On a slow connection
  // the scripts can take many seconds, and a page that starts hidden stays blank until they run. Once the page is
  // interactive, only what is still below the first screen is hidden, and it is revealed as it scrolls into view.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion) return;
    if (element.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [reduceMotion]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={!armed || inView ? "show" : "hidden"}
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
