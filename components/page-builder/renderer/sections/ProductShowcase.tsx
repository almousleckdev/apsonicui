'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { Buttons, CmsLink, EmptyHint, SectionHeading, SectionShell, bool, buttonsOf, num, pick, str, text, type SectionProps } from '../shared';

const COLUMNS = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4' } as const;

export function ProductShowcase({ section, ctx }: SectionProps) {
  const c = section.content;
  const category = str(c, 'categorySlug');
  const limit = num(c, 'limit', 4);
  const dark = resolveStyle(section.style).dark;
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['page-products', category, limit],
    queryFn: () => productService.getProducts({ category: category || undefined, size: limit }),
  });
  const shown = products.filter((p) => p.active !== false).slice(0, limit);

  if (!isLoading && shown.length === 0) return <EmptyHint editing={ctx.editing}>Product showcase: no products found for this category.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={dark} />
      <ul className={cn('grid grid-cols-1 gap-6', COLUMNS[pick(c.columns, ['2', '3', '4'] as const, '4')])}>
        {shown.map((p) => (
          <li key={p.id}>
            <CmsLink href={`/products/${p.slug}`} className={cn('group block overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg', dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white text-zinc-900')}>
              <span className="relative block aspect-[4/3] bg-zinc-100">
                {p.image && <Image src={p.image} alt="" fill unoptimized sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />}
              </span>
              <span className="block p-5">
                {bool(c, 'showCategory', true) && <span className={cn('block text-xs font-bold uppercase tracking-wider', dark ? 'text-white/70' : 'text-zinc-500')}>{p.category}</span>}
                <span className="mt-1 block text-lg font-extrabold">{p.model}</span>
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
      <Buttons items={buttonsOf(c)} section={section} ctx={ctx} className="mt-10 justify-center" />
    </SectionShell>
  );
}
