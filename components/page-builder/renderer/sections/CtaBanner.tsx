'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { clamp, cssPosition, cssSize, resolveStyle } from '@/lib/page-builder/style';
import { Buttons, CoverImage, EmptyHint, Overlay, bool, buttonsOf, num, pick, str, styleProps, text, type SectionProps } from '../shared';

const HEIGHTS = { sm: 'min-h-[200px]', md: 'min-h-[320px]', lg: 'min-h-[460px]', custom: '' } as const;
const ALIGN = { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' } as const;

export function CtaBanner({ section, ctx }: SectionProps) {
  const c = section.content;
  const r = resolveStyle(section.style);
  const heading = text(c, 'heading', ctx.locale);
  const body = text(c, 'text', ctx.locale);
  const image = str(c, 'image');
  const ctas = buttonsOf(c);
  const align = pick(c.align, ['left', 'center', 'right'] as const, 'center');
  const height = pick(c.height, ['sm', 'md', 'lg', 'custom'] as const, 'md');
  const own = styleProps(r);

  if (!heading && ctas.length === 0) return <EmptyHint editing={ctx.editing}>Call to action: add a heading and a button.</EmptyHint>;

  return (
    <section className={cn('relative isolate overflow-hidden', own.className)} style={own.style}>
      {image && (
        <>
          <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
            <CoverImage src={image} size={cssSize(c.imageSize)} position={cssPosition(c.imagePosition)} fixed={bool(c, 'imageFixed', false)} />
          </div>
          <div className="absolute inset-0 -z-10" aria-hidden><Overlay color={str(c, 'overlayColor') || '#000000'} strength={clamp(num(c, 'overlay', 50), 0, 90)} /></div>
        </>
      )}
      <div
        className={cn('mx-auto flex flex-col justify-center px-4 sm:px-6 lg:px-8', r.padTop, r.padBottom, r.width, HEIGHTS[height], ALIGN[align])}
        style={height === 'custom' ? { minHeight: clamp(num(c, 'minHeight', 320), 160, 800) } : undefined}
      >
        {heading && <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{heading}</h2>}
        {body && <p className="mt-4 max-w-2xl text-lg opacity-90">{body}</p>}
        <Buttons items={ctas} section={section} ctx={ctx} onImage={!!image} className={cn('mt-8', align === 'center' && 'justify-center', align === 'right' && 'justify-end')} />
      </div>
    </section>
  );
}
