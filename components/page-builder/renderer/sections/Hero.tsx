'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { safeColor } from '@/lib/page-builder/colors';
import { clamp, cssPosition, cssSize, resolveStyle, textStyle } from '@/lib/page-builder/style';
import { Buttons, CoverImage, EmptyHint, Overlay, isVideoUrl, list, num, pick, str, styleProps, text, type SectionProps } from '../shared';

const HEIGHTS = { md: 'min-h-[420px]', lg: 'min-h-[560px]', full: 'min-h-[100svh]', custom: '' } as const;
const ALIGN = { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' } as const;
const VERTICAL = { top: 'justify-start', center: 'justify-center', bottom: 'justify-end' } as const;

export function Hero({ section, ctx }: SectionProps) {
  const c = section.content;
  const r = resolveStyle(section.style);
  const eyebrow = text(c, 'eyebrow', ctx.locale);
  const heading = text(c, 'heading', ctx.locale);
  const sub = text(c, 'subheading', ctx.locale);
  const desktop = str(c, 'desktopImage');
  const mobile = str(c, 'mobileImage');
  const video = str(c, 'videoUrl');
  const ctas = list(c, 'ctas');
  const align = pick(c.align, ['left', 'center', 'right'] as const, 'left');
  const vertical = pick(c.verticalAlign, ['top', 'center', 'bottom'] as const, 'center');
  const height = pick(c.height, ['md', 'lg', 'full', 'custom'] as const, 'lg');
  const size = cssSize(c.imageSize) === 'contain' ? 'contain' : 'cover';
  const position = cssPosition(c.imagePosition);
  const tint = clamp(num(c, 'overlay', 40), 0, 90);
  const overlayStyle = pick(c.overlayStyle, ['solid', 'bottom', 'top'] as const, 'solid');
  const bg = safeColor(c.backgroundColor) ?? '#09090b';
  const own = styleProps({ ...r, backgroundClass: '', backgroundColor: undefined, dark: true });
  const eyebrowStyle = textStyle(r, 'eyebrow', 'eyebrow', r.accentColor ?? '#ffd700');
  const headingStyle = textStyle(r, 'heading', 'h1');
  const subStyle = textStyle(r, 'subheading', 'sub-lg');
  const hasMedia = !!(desktop || mobile || video);

  if (!heading && !sub && !eyebrow && !hasMedia && ctas.length === 0) {
    // A hero is drawn underneath the fixed site header, so its placeholder needs the header's height of room.
    return <div className="pt-20"><EmptyHint editing={ctx.editing}>Hero banner: add a heading and a picture in the panel.</EmptyHint></div>;
  }

  return (
    <section
      className={cn('relative isolate flex w-full overflow-hidden', HEIGHTS[height], own.className, r.showOn)}
      style={{ ...own.style, background: bg, ...(height === 'custom' ? { minHeight: clamp(num(c, 'minHeight', 560), 240, 1000) } : {}) }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        {video && isVideoUrl(video) ? (
          <video src={video} poster={desktop || undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full" style={{ objectFit: size, objectPosition: position }} />
        ) : (
          <>
            {desktop && <CoverImage src={desktop} size={size} position={position} priority className={cn(mobile && 'hidden md:block')} />}
            {mobile && <CoverImage src={mobile} size={size} position={position} priority className="md:hidden" />}
          </>
        )}
      </div>
      <div className="absolute inset-0 -z-10" aria-hidden><Overlay color={str(c, 'overlayColor') || '#000000'} strength={tint} mode={overlayStyle} /></div>

      <div className={cn('mx-auto flex w-full max-w-[1360px] flex-col px-4 py-24 sm:px-6 lg:px-8', ALIGN[align], VERTICAL[vertical])}>
        {eyebrow && <span className={cn('mb-3 text-xs font-extrabold uppercase tracking-[0.25em]', eyebrowStyle.className)} style={eyebrowStyle.style}>{eyebrow}</span>}
        {heading && <h1 className={cn('max-w-3xl text-4xl font-black uppercase tracking-tight drop-shadow-md text-balance sm:text-5xl md:text-6xl', headingStyle.className)} style={headingStyle.style}>{heading}</h1>}
        {sub && <p className={cn('mt-5 max-w-2xl text-lg font-medium opacity-90 sm:text-xl', subStyle.className)} style={subStyle.style}>{sub}</p>}
        <Buttons items={ctas} section={section} ctx={ctx} onImage className={cn('mt-8', align === 'center' && 'justify-center', align === 'right' && 'justify-end')} />
      </div>
    </section>
  );
}
