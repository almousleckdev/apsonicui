"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { getLocalizedStories } from "@/lib/data/about";

export const VoicesSection = () => {
  const locale = useLocale();
  const localizedStories = getLocalizedStories(locale);

  return (
    <section className="w-full py-20 bg-white border-b border-zinc-100 relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-extrabold text-xs uppercase tracking-[0.25em] text-brand-green">
            {locale === "zh" ? "社区" : "Community"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-zinc-950">
            {locale === "zh" ? "大陆的声音" : "Voices of the Continent"}
          </h2>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {localizedStories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
              }}
              className="relative flex flex-col h-full rounded-2xl bg-zinc-50 p-8 border border-zinc-100 transition-all duration-300 group select-none animate-fade-in-up"
            >
              {/* Quote mark ornament */}
              <div className="absolute top-6 right-6 opacity-5 text-zinc-950">
                <Quote className="w-12 h-12 transform rotate-180" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed italic mb-8 flex-grow">
                  &ldquo;{story.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 mt-auto pt-5 border-t border-zinc-100/60">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-zinc-100 shrink-0">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      sizes="48px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-zinc-900 font-bold truncate text-sm sm:text-base">
                      {story.name}
                    </h4>
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block mt-0.5 truncate">
                      {story.role}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
