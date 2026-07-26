"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ENTERPRISE_EASE,
  WORD_REVEAL_VARIANTS,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils";

type Tag = "span" | "h1" | "h2" | "h3" | "p";

interface RevealTextProps {
  text: string;
  as?: Tag;
  className?: string;
  wordClassName?: string;
  /** Delay, in seconds, before the first word starts revealing. */
  delay?: number;
  /** Seconds between each word's reveal. */
  stagger?: number;
  /** Reveal on scroll into view (default) vs. immediately on mount - use false for above-the-fold text. */
  viewport?: boolean;
  justify?: "start" | "center" | "end";
}

const JUSTIFY_CLASS: Record<NonNullable<RevealTextProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  as = "span",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  viewport = true,
  justify = "start",
}) => {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const Element = as as React.ElementType;

  if (reduceMotion) {
    return <Element className={className}>{text}</Element>;
  }

  const revealProps = viewport
    ? { whileInView: "show", viewport: { once: true, amount: 0.6 } }
    : { animate: "show" };

  return (
    <Element className={className}>
      <motion.span
        initial="hidden"
        {...revealProps}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
        className={cn("flex flex-wrap", JUSTIFY_CLASS[justify])}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] last:mr-0"
          >
            <motion.span
              variants={WORD_REVEAL_VARIANTS}
              transition={{ duration: 0.65, ease: ENTERPRISE_EASE }}
              className={cn("inline-block", wordClassName)}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Element>
  );
};
