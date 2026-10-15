'use client';

import React from 'react';
import { EmptyHint, SectionHeading, SectionShell, isDark, str, text, type SectionProps } from '../shared';

export function Video({ section, ctx }: SectionProps) {
  const c = section.content;
  const src = str(c, 'videoUrl');
  if (!src) return <EmptyHint editing={ctx.editing}>Video: upload a video file in the panel.</EmptyHint>;
  const caption = text(c, 'caption', ctx.locale);
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={isDark(section.style)} />
      <div className="overflow-hidden rounded-3xl bg-zinc-950 shadow-xl">
        <video src={src} poster={str(c, 'poster') || undefined} controls playsInline preload="metadata" className="aspect-video w-full object-cover" />
      </div>
      {caption && <p className="mt-3 text-center text-sm font-medium opacity-80">{caption}</p>}
    </SectionShell>
  );
}
