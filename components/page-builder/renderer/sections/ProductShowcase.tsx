'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product';
import { cn } from '@/lib/utils';
import { BUTTON_PRIMARY, CmsLink, EmptyHint, SectionHeading, SectionShell, isDark, num, str, text, type SectionProps } from '../shared';

export function ProductShowcase({ section, ctx }: SectionProps) {
  const c = section.content;
  const category = str(c, 'categorySlug');
  const limit = num(c, 'limit', 4);
  const dark = isDark(section.style);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['page-products', category, limit],
    queryFn: () => productService.getProducts({ category: category || undefined, size: limit }),
  });
  const shown = products.filter((p) => p.active !== false).slice(0, limit);
  const cta = text(c, 'ctaLabel', ctx.locale);
  const ctaUrl = str(c, 'ctaUrl');

  if (!isLoading && shown.length === 0) return <EmptyHint editing={ctx.editing}>Product showcase: no products found for this category.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={dark} />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((p) => (
          <li key={p.id}>
            <CmsLink href={`/products/${p.slug}`} className={cn('group block overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg', dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white')}>
              <span className="relative block aspect-[4/3] bg-zinc-100">
                {p.image && <Image src={p.image} alt="" fill unoptimized sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />}
              </span>
              <span className="block p-5">
                <span className={cn('block text-xs font-bold uppercase tracking-wider', dark ? 'text-white/70' : 'text-zinc-500')}>{p.category}</span>
                <span className="mt-1 block text-lg font-extrabold">{p.model}</span>
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
      {cta && ctaUrl && (
        <div className="mt-10 text-center">
          <CmsLink href={ctaUrl} className={BUTTON_PRIMARY}>{cta}</CmsLink>
        </div>
      )}
    </SectionShell>
  );
}
