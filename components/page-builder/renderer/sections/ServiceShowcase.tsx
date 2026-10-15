'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { CmsImage, CmsLink, EmptyHint, SectionHeading, SectionShell, isDark, list, str, text, type SectionProps } from '../shared';

export function ServiceShowcase({ section, ctx }: SectionProps) {
  const c = section.content;
  const items = list(c, 'items').filter((i) => text(i, 'title', ctx.locale));
  const dark = isDark(section.style);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Service showcase: add services in the panel.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={dark} />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const image = str(item, 'image');
          const url = str(item, 'url');
          const body = text(item, 'text', ctx.locale);
          const card = (
            <>
              {image && (
                <span className="relative block aspect-[16/10] overflow-hidden bg-zinc-100">
                  <CmsImage src={image} alt="" sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
              )}
              <span className="block p-6">
                <span className="block text-lg font-extrabold">{text(item, 'title', ctx.locale)}</span>
                {body && <span className={cn('mt-2 block text-sm leading-relaxed', dark ? 'text-white/75' : 'text-zinc-600')}>{body}</span>}
                {url && <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-green">→<ArrowRight className="h-4 w-4" aria-hidden /></span>}
              </span>
            </>
          );
          const cls = cn('group block h-full overflow-hidden rounded-2xl border', dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white shadow-sm');
          return <li key={i}>{url ? <CmsLink href={url} className={cn(cls, 'transition-shadow hover:shadow-lg')}>{card}</CmsLink> : <div className={cls}>{card}</div>}</li>;
        })}
      </ul>
    </SectionShell>
  );
}
