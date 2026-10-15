'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BUTTON_PRIMARY, BUTTON_SECONDARY_LIGHT, CmsImage, CmsLink, EmptyHint, isVideoUrl, list, num, str, text, type SectionProps } from '../shared';

const HEIGHTS: Record<string, string> = { md: 'min-h-[420px]', lg: 'min-h-[560px]', full: 'min-h-[100svh]' };
const ALIGN: Record<string, string> = { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' };

export function Hero({ section, ctx }: SectionProps) {
  const c = section.content;
  const heading = text(c, 'heading', ctx.locale);
  const sub = text(c, 'subheading', ctx.locale);
  const desktop = str(c, 'desktopImage');
  const mobile = str(c, 'mobileImage');
  const video = str(c, 'videoUrl');
  const overlay = Math.min(90, Math.max(0, num(c, 'overlay', 40)));
  const align = str(c, 'align') || 'left';
  const height = str(c, 'height') || 'lg';
  const ctas = list(c, 'ctas');

  if (!heading && !sub && !desktop && !video && ctas.length === 0) {
    // A hero is drawn underneath the fixed site header, so its placeholder needs the header's height of room.
    return <div className="pt-20"><EmptyHint editing={ctx.editing}>Hero banner: add a heading and an image in the panel.</EmptyHint></div>;
  }

  return (
    <section className={cn('relative isolate flex w-full overflow-hidden bg-zinc-950', HEIGHTS[height] ?? HEIGHTS.lg)}>
      {video && isVideoUrl(video) ? (
        <video src={video} poster={desktop || undefined} autoPlay muted loop playsInline className="absolute inset-0 -z-10 h-full w-full object-cover" />
      ) : (
        <>
          {desktop && <CmsImage src={desktop} alt="" priority className={cn('-z-10 object-cover', mobile && 'hidden md:block')} />}
          {mobile && <CmsImage src={mobile} alt="" priority className="-z-10 object-cover md:hidden" />}
        </>
      )}
      <div className="absolute inset-0 -z-10 bg-black" style={{ opacity: overlay / 100 }} aria-hidden />
      <div className={cn('mx-auto flex w-full max-w-[1360px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-8', ALIGN[align] ?? ALIGN.left)}>
        {heading && <h1 className="max-w-3xl text-4xl font-black uppercase tracking-tight text-white drop-shadow-md text-balance sm:text-5xl md:text-6xl">{heading}</h1>}
        {sub && <p className="mt-5 max-w-2xl text-lg font-medium text-zinc-200 sm:text-xl">{sub}</p>}
        {ctas.length > 0 && (
          <div className={cn('mt-8 flex flex-wrap gap-3', align === 'center' && 'justify-center', align === 'right' && 'justify-end')}>
            {ctas.map((cta, i) => {
              const label = text(cta, 'label', ctx.locale);
              const url = str(cta, 'url');
              if (!label || !url) return null;
              return (
                <CmsLink key={i} href={url} className={str(cta, 'variant') === 'secondary' ? BUTTON_SECONDARY_LIGHT : BUTTON_PRIMARY}>
                  {label}
                </CmsLink>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
