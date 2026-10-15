'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CmsImage, CmsLink, EmptyHint, str, text, type SectionProps } from '../shared';

export function CtaBanner({ section, ctx }: SectionProps) {
  const c = section.content;
  const heading = text(c, 'heading', ctx.locale);
  const body = text(c, 'text', ctx.locale);
  const label = text(c, 'buttonLabel', ctx.locale);
  const url = str(c, 'buttonUrl');
  const image = str(c, 'image');
  if (!heading && !label) return <EmptyHint editing={ctx.editing}>Call to action: add a heading and a button.</EmptyHint>;
  return (
    <section className={cn('relative isolate overflow-hidden', image ? 'bg-zinc-950' : 'bg-brand-green', 'px-4 py-16 sm:px-6 sm:py-20 lg:px-8')}>
      {image && (
        <>
          <CmsImage src={image} alt="" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden />
        </>
      )}
      <div className="mx-auto max-w-3xl text-center text-white">
        {heading && <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{heading}</h2>}
        {body && <p className="mt-4 text-lg text-white/90">{body}</p>}
        {label && url && (
          <CmsLink href={url} className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            {label}
          </CmsLink>
        )}
      </div>
    </section>
  );
}
