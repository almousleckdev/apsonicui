'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { CmsImage, EmptyHint, SectionHeading, SectionShell, isDark, list, str, text, type SectionProps } from '../shared';

const COLUMNS: Record<string, string> = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4' };

export function Gallery({ section, ctx }: SectionProps) {
  const c = section.content;
  const items = list(c, 'items').filter((i) => str(i, 'image'));
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Image gallery: add images in the panel.</EmptyHint>;
  const images = items.map((i) => str(i, 'image'));

  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={isDark(section.style)} />
      <ul className={cn('grid grid-cols-1 gap-4', COLUMNS[str(c, 'columns') || '3'])}>
        {items.map((item, i) => {
          const caption = text(item, 'caption', ctx.locale);
          return (
            <li key={i}>
              <button type="button" onClick={() => setOpen(i)} className="group block w-full cursor-zoom-in text-left" aria-label={caption || `Open image ${i + 1}`}>
                <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
                  <CmsImage src={images[i]} alt={caption} sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                {caption && <span className="mt-2 block text-sm font-medium opacity-80">{caption}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <ImageLightbox isOpen={open !== null} onClose={() => setOpen(null)} images={images} currentIndex={open ?? 0} onChangeIndex={setOpen} />
    </SectionShell>
  );
}
