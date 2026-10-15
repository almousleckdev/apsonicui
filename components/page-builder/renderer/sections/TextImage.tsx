'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BUTTON_PRIMARY, CmsImage, CmsLink, EmptyHint, SectionShell, isDark, str, text, type SectionProps } from '../shared';

export function TextImage({ section, ctx }: SectionProps) {
  const c = section.content;
  const eyebrow = text(c, 'eyebrow', ctx.locale);
  const heading = text(c, 'heading', ctx.locale);
  const body = text(c, 'body', ctx.locale);
  const image = str(c, 'image');
  const cta = text(c, 'ctaLabel', ctx.locale);
  const ctaUrl = str(c, 'ctaUrl');
  const imageRight = str(c, 'imagePosition') === 'right';
  const dark = isDark(section.style);

  if (!heading && !body && !image) return <EmptyHint editing={ctx.editing}>Text and image: add a heading, text and a picture.</EmptyHint>;

  return (
    <SectionShell section={section}>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {image && (
          <div className={cn('relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-100', imageRight && 'lg:order-2')}>
            <CmsImage src={image} alt={text(c, 'imageAlt', ctx.locale)} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
        <div className={cn(!image && 'lg:col-span-2 max-w-3xl')}>
          {eyebrow && <span className={cn('text-xs font-extrabold uppercase tracking-[0.25em]', dark ? 'text-white/80' : 'text-brand-green')}>{eyebrow}</span>}
          {heading && <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{heading}</h2>}
          {body && <div className={cn('prose mt-5 max-w-none', dark && 'prose-invert [&_*]:!text-inherit')} dangerouslySetInnerHTML={{ __html: body }} />}
          {cta && ctaUrl && <CmsLink href={ctaUrl} className={cn(BUTTON_PRIMARY, 'mt-8')}>{cta}</CmsLink>}
        </div>
      </div>
    </SectionShell>
  );
}
