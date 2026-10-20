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
// The public card is moved by framer-motion alone: a CSS transition or keyframe animation on the same element
// would fight its inline transform and make the hover stutter.
const BASE_CLASSES = "relative flex flex-col h-full rounded-2xl bg-zinc-50 p-8 border border-zinc-100 group select-none";

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
    return <div className={BASE_CLASSES}>{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{
        y: -4,
        boxShadow: "0 16px 32px -12px rgba(0, 0, 0, 0.12)",
        transition: { type: "spring", stiffness: 300, damping: 26, delay: 0 },
      }}
      className={`${BASE_CLASSES} will-change-transform`}
    >
      {content}
    </motion.div>
  );
};
