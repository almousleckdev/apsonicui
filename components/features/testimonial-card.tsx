"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export interface TestimonialCardProps {
  quote: string;
  name: string;
  role?: string;
  /** Site-relative photo path; when empty the card shows the person's initials. */
  image?: string;
  /** Position in the grid; staggers the entrance animation. */
  index?: number;
  /** Public site: fade/slide in on scroll and lift on hover. Admin preview: a still card. */
  animated?: boolean;
}

// The one place that defines how a testimonial looks. The homepage section and the admin preview both render this.
const CARD_CLASSES =
  "relative flex flex-col h-full rounded-2xl bg-zinc-50 p-8 border border-zinc-100 transition-all duration-300 group select-none animate-fade-in-up";

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, image, index = 0, animated = false }) => {
  const content = (
    <>
      {/* Quote mark ornament */}
      <div className="absolute top-6 right-6 opacity-5 text-zinc-950">
        <Quote className="w-12 h-12 transform rotate-180" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed italic mb-8 flex-grow">&ldquo;{quote}&rdquo;</p>

        <div className="flex items-center gap-4 mt-auto pt-5 border-t border-zinc-100/60">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-zinc-100 shrink-0 bg-zinc-100 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="48px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span aria-hidden="true" className="text-xs font-bold text-zinc-500">
                {initialsOf(name)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-zinc-900 font-bold truncate text-sm sm:text-base">{name}</h4>
            {role && (
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block mt-0.5 truncate">{role}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (!animated) {
    return <div className={CARD_CLASSES}>{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
      }}
      className={CARD_CLASSES}
    >
      {content}
    </motion.div>
  );
};
