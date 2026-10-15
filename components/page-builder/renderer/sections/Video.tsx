'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { EmptyHint, SectionHeading, SectionShell, bool, pick, str, text, type SectionProps } from '../shared';

const RATIO = { '16-9': 'aspect-video', '4-3': 'aspect-[4/3]', '1-1': 'aspect-square', '21-9': 'aspect-[21/9]' } as const;

export function Video({ section, ctx }: SectionProps) {
  const c = section.content;
  const src = str(c, 'videoUrl');
  if (!src) return <EmptyHint editing={ctx.editing}>Video: upload a video file in the panel.</EmptyHint>;
  const caption = text(c, 'caption', ctx.locale);
  const autoplay = bool(c, 'autoplay', false);
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={resolveStyle(section.style).dark} />
      <div className={cn('overflow-hidden bg-zinc-950 shadow-xl', bool(c, 'rounded', true) ? 'rounded-3xl' : 'rounded-none')}>
        <video src={src} poster={str(c, 'poster') || undefined} controls={bool(c, 'controls', true)} playsInline preload="metadata"
          // Browsers only allow a video to start by itself when it is muted.
          autoPlay={autoplay} muted={autoplay} loop={bool(c, 'loop', false)}
          className={cn('w-full object-cover', RATIO[pick(c.ratio, ['16-9', '4-3', '1-1', '21-9'] as const, '16-9')])} />
      </div>
      {caption && <p className="mt-3 text-center text-sm font-medium opacity-80">{caption}</p>}
    </SectionShell>
  );
}
