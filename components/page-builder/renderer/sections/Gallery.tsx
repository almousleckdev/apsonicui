'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { resolveStyle } from '@/lib/page-builder/style';
import { CoverImage, EmptyHint, SectionHeading, SectionShell, bool, list, pick, str, text, type SectionProps } from '../shared';

const COLUMNS = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4', '5': 'sm:grid-cols-3 lg:grid-cols-5' } as const;
const RATIO = { '4-3': 'aspect-[4/3]', '1-1': 'aspect-square', '16-9': 'aspect-video', auto: '' } as const;
const GAP = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' } as const;
const ROUND = { none: 'rounded-none', md: 'rounded-lg', xl: 'rounded-2xl' } as const;

export function Gallery({ section, ctx }: SectionProps) {
  const c = section.content;
  const items = list(c, 'items').filter((i) => str(i, 'image'));
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Image gallery: add images in the panel.</EmptyHint>;
  const images = items.map((i) => str(i, 'image'));
  const ratio = pick(c.ratio, ['4-3', '1-1', '16-9', 'auto'] as const, '4-3');
  const round = ROUND[pick(c.rounded, ['none', 'md', 'xl'] as const, 'xl')];
  const lightbox = bool(c, 'lightbox', true);

  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={resolveStyle(section.style).dark} />
      <ul className={cn('grid grid-cols-1', COLUMNS[pick(c.columns, ['2', '3', '4', '5'] as const, '3')], GAP[pick(c.gap, ['sm', 'md', 'lg'] as const, 'md')])}>
        {items.map((item, i) => {
          const caption = text(item, 'caption', ctx.locale);
          const picture = (
            <span className={cn('relative block overflow-hidden bg-zinc-100', round, RATIO[ratio])}>
              {ratio === 'auto'
                // Original shape: let the picture decide its own height.
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={images[i]} alt={caption} loading="lazy" className="block h-auto w-full" />
                : <CoverImage src={images[i]} alt={caption} sizes="(min-width: 1024px) 33vw, 100vw" className="transition-transform duration-500 group-hover:scale-105" />}
            </span>
          );
          return (
            <li key={i}>
              {lightbox ? (
                <button type="button" onClick={() => setOpen(i)} className="group block w-full cursor-zoom-in text-left" aria-label={caption || `Open image ${i + 1}`}>
                  {picture}
                  {caption && <span className="mt-2 block text-sm font-medium opacity-80">{caption}</span>}
                </button>
              ) : (
                <div className="group">{picture}{caption && <span className="mt-2 block text-sm font-medium opacity-80">{caption}</span>}</div>
              )}
            </li>
          );
        })}
      </ul>
      {lightbox && <ImageLightbox isOpen={open !== null} onClose={() => setOpen(null)} images={images} currentIndex={open ?? 0} onChangeIndex={setOpen} />}
    </SectionShell>
  );
}
