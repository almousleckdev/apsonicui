'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { Buttons, CoverImage, EmptyHint, SectionShell, buttonsOf, pick, str, text, type SectionProps } from '../shared';

const RATIO = { '4-3': 'aspect-[4/3]', '1-1': 'aspect-square', '16-9': 'aspect-video', '3-4': 'aspect-[3/4]' } as const;
const SHAPE = { rounded: 'rounded-3xl', square: 'rounded-none', circle: 'rounded-full' } as const;
const VERTICAL = { top: 'items-start', center: 'items-center', bottom: 'items-end' } as const;

export function TextImage({ section, ctx }: SectionProps) {
  const c = section.content;
  const r = resolveStyle(section.style);
  const eyebrow = text(c, 'eyebrow', ctx.locale);
  const heading = text(c, 'heading', ctx.locale);
  const body = text(c, 'body', ctx.locale);
  const image = str(c, 'image');
  const imageRight = str(c, 'imagePosition') === 'right';
  const center = c.textAlign === 'center';
  const shape = pick(c.imageStyle, ['rounded', 'square', 'circle'] as const, 'rounded');
  const ratio = shape === 'circle' ? 'aspect-square' : RATIO[pick(c.imageRatio, ['4-3', '1-1', '16-9', '3-4'] as const, '4-3')];

  if (!heading && !body && !image) return <EmptyHint editing={ctx.editing}>Text and image: add a heading, text and a picture.</EmptyHint>;

  return (
    <SectionShell section={section}>
      <div className={cn('grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16', VERTICAL[pick(c.verticalAlign, ['top', 'center', 'bottom'] as const, 'center')])}>
        {image && (
          <div className={cn('relative overflow-hidden bg-zinc-100', ratio, SHAPE[shape], imageRight && 'lg:order-2')}>
            <CoverImage src={image} alt={text(c, 'imageAlt', ctx.locale)} size={c.imageFit === 'contain' ? 'contain' : 'cover'} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        )}
        <div className={cn(!image && 'lg:col-span-2 max-w-3xl', center && 'text-center')}>
          {eyebrow && <span className="pb-accent text-xs font-extrabold uppercase tracking-[0.25em]">{eyebrow}</span>}
          {heading && <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{heading}</h2>}
          {body && <div className={cn('prose mt-5 max-w-none', r.dark && 'prose-invert [&_*]:!text-inherit')} dangerouslySetInnerHTML={{ __html: body }} />}
          <Buttons items={buttonsOf(c)} section={section} ctx={ctx} className={cn('mt-8', center && 'justify-center')} />
        </div>
      </div>
    </SectionShell>
  );
}
