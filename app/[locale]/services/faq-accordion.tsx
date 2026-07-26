"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FAQItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={item.id}
            className={cn(
              "rounded-2xl border transition-all duration-300 overflow-hidden",
              isOpen
                ? "bg-white border-zinc-200/80 shadow-md"
                : "bg-white border-zinc-100 shadow-sm hover:border-zinc-200/60"
            )}
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 select-none cursor-pointer outline-none"
            >
              <span>{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border shrink-0 text-zinc-400",
                  isOpen ? "border-brand-green/20 text-brand-green bg-brand-green/5" : "border-zinc-100"
                )}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-xs sm:text-sm text-zinc-500 leading-relaxed font-medium border-t border-zinc-100/60 pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
