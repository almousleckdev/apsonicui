'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { homepageService } from '@/services/homepage-service';
import { resolveTestimonials } from '@/lib/homepage/testimonials';
import { TestimonialCard } from '@/components/features/testimonial-card';
import { EmptyHint, SectionHeading, SectionShell, isDark, num, text, type SectionProps } from '../shared';

export function Testimonials({ section, ctx }: SectionProps) {
  const c = section.content;
  const limit = num(c, 'limit', 3);
  const { data: config } = useQuery({ queryKey: ['homepage-config'], queryFn: () => homepageService.getHomepageConfig() });
  const items = resolveTestimonials(config?.testimonials, ctx.locale).slice(0, limit);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Testimonials: none have been added yet (Home Page &gt; Testimonials).</EmptyHint>;
  return (
    <SectionShell section={section} className="max-w-[1360px]">
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={isDark(section.style)} />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {items.map((t, i) => <TestimonialCard key={t.id} quote={t.quote} name={t.name} role={t.role} image={t.image} index={i} animated />)}
      </div>
    </SectionShell>
  );
}
