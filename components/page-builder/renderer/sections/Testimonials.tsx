'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Quote, Star } from 'lucide-react';
import { homepageService } from '@/services/homepage-service';
import { resolveTestimonials } from '@/lib/homepage/testimonials';
import { cn } from '@/lib/utils';
import { clamp, resolveStyle } from '@/lib/page-builder/style';
import { safeColor } from '@/lib/page-builder/colors';
import { EmptyHint, SectionHeading, SectionShell, bool, cardProps, list, num, pick, str, text, type SectionProps } from '../shared';

const COLUMNS = { 1: 'max-w-2xl mx-auto', 2: 'md:grid-cols-2 max-w-4xl mx-auto', 3: 'md:grid-cols-2 lg:grid-cols-3' } as const;

interface Entry {
  key: string;
  quote: string;
  name: string;
  role?: string;
  photo?: string;
  rating: number;
}

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');

export function Testimonials({ section, ctx }: SectionProps) {
  const c = section.content;
  const r = resolveStyle(section.style);
  // Sections made before testimonials could be written here have no "source": they keep using the site list.
  const source = c.source === 'custom' ? 'custom' : c.source === 'site' || c.source === undefined ? 'site' : 'custom';
  const limit = clamp(num(c, 'limit', 3), 1, 12);
  const { data: config } = useQuery({ queryKey: ['homepage-config'], queryFn: () => homepageService.getHomepageConfig(), enabled: source === 'site' });

  const entries: Entry[] = source === 'custom'
    ? list(c, 'items').filter((i) => text(i, 'quote', ctx.locale) && str(i, 'name')).map((i, n) => ({
        key: String(n), quote: text(i, 'quote', ctx.locale), name: str(i, 'name'), role: text(i, 'role', ctx.locale) || undefined,
        photo: str(i, 'photo') || undefined, rating: clamp(num(i, 'rating', 0), 0, 5),
      }))
    : resolveTestimonials(config?.testimonials, ctx.locale).slice(0, limit).map((t) => ({ key: t.id, quote: t.quote, name: t.name, role: t.role, photo: t.image, rating: 0 }));

  if (entries.length === 0) {
    return <EmptyHint editing={ctx.editing}>{source === 'custom' ? 'Testimonials: add what your customers say in the panel.' : 'Testimonials: none have been added to the site list yet (Home Page > Testimonials).'}</EmptyHint>;
  }

  const card = pick(c.cardStyle, ['filled', 'boxed', 'plain'] as const, 'filled');
  const center = c.align === 'center';
  const custom = cardProps(c.cardColor);
  const star = safeColor(c.starColor) ?? '#f5b301';
  // Never more columns than testimonials, so one or two cards sit centered instead of hugging the left edge.
  const columns = Math.min(Number(pick(c.columns, ['1', '2', '3'] as const, '3')), entries.length) as 1 | 2 | 3;

  return (
    <SectionShell section={section} className="max-w-[1360px]">
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={r.dark} />
      <div className={cn('grid grid-cols-1 gap-6 lg:gap-8', COLUMNS[columns])}>
        {entries.map((t) => (
          // Not <figure>: the site has a global rule for bare figure/figcaption (news articles) that would override these classes.
          <div key={t.key} role="group" className={cn('flex h-full flex-col rounded-2xl p-7', center && 'items-center text-center',
            custom.className, !custom.className && card === 'filled' && (r.dark ? 'bg-white/10' : 'bg-zinc-50 text-zinc-900'),
            !custom.className && card === 'boxed' && (r.dark ? 'border border-white/20' : 'border border-zinc-200 bg-white text-zinc-900'),
            card === 'boxed' && custom.className && 'border border-black/10')} style={custom.style}>
            {bool(c, 'showQuoteIcon', true) && <Quote className="pb-accent h-8 w-8 opacity-80" aria-hidden />}
            {t.rating > 0 && (
              <div className="mt-3 flex gap-0.5" role="img" aria-label={`${t.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-4 w-4" style={{ color: n <= t.rating ? star : undefined, fill: n <= t.rating ? star : 'none', opacity: n <= t.rating ? 1 : 0.3 }} aria-hidden />)}
              </div>
            )}
            <blockquote className="mt-4 flex-1 text-base leading-relaxed">“{t.quote}”</blockquote>
            <footer className={cn('mt-6 flex items-center gap-3', center && 'justify-center')}>
              {t.photo ? (
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-200">
                  <Image src={t.photo} alt="" fill unoptimized sizes="44px" className="object-cover" />
                </span>
              ) : (
                <span className="pb-accent-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white" aria-hidden>{initialsOf(t.name)}</span>
              )}
              <span className="text-left">
                <span className="block text-sm font-extrabold">{t.name}</span>
                {t.role && <span className="block text-xs opacity-70">{t.role}</span>}
              </span>
            </footer>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
