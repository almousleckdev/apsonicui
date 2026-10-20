"use client";

import React from "react";
import { useLocale } from "next-intl";
import { TestimonialCard } from "@/components/features/testimonial-card";
import { resolveTestimonials } from "@/lib/homepage/testimonials";
import type { HomeTestimonialItem } from "@/lib/types/homepage";

interface VoicesSectionProps {
  /** Testimonials managed in the admin (Home Page > Testimonials). */
  initialConfig?: HomeTestimonialItem[];
}

export const VoicesSection: React.FC<VoicesSectionProps> = ({ initialConfig }) => {
  const locale = useLocale();
  const testimonials = resolveTestimonials(initialConfig, locale);

  // Nothing to show (all removed, or none complete): hide the whole section instead of an empty heading.
  if (testimonials.length === 0) return null;

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
          {testimonials.map((t, index) => (
            <TestimonialCard key={t.id} quote={t.quote} name={t.name} role={t.role} image={t.image} index={index} animated />
          ))}
        </div>

      </div>
    </section>
  );
};
