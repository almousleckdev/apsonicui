'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { resolveStyle } from '@/lib/page-builder/style';
import { CoverImage, CmsLink, EmptyHint, SectionHeading, SectionShell, cardProps, list, pick, str, text, type SectionProps } from '../shared';

const COLUMNS = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4' } as const;

export function ServiceShowcase({ section, ctx }: SectionProps) {
  const c = section.content;
  const dark = resolveStyle(section.style).dark;
  const items = list(c, 'items').filter((i) => text(i, 'title', ctx.locale));
  const custom = cardProps(c.cardColor);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Service showcase: add services in the panel.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading section={section} ctx={ctx} />
      <ul className={cn('grid grid-cols-1 gap-6', COLUMNS[pick(c.columns, ['2', '3', '4'] as const, '3')])}>
        {items.map((item, i) => {
          const image = str(item, 'image');
          const url = str(item, 'url');
          const body = text(item, 'text', ctx.locale);
          const card = (
            <>
              {image && (
                <span className="relative block aspect-[16/10] overflow-hidden bg-zinc-100">
                  <CoverImage src={image} sizes="(min-width: 1024px) 33vw, 100vw" className="transition-transform duration-500 group-hover:scale-105" />
                </span>
              )}
              <span className="block p-6">
                <span className="block text-lg font-extrabold">{text(item, 'title', ctx.locale)}</span>
                {body && <span className="mt-2 block text-sm leading-relaxed opacity-75">{body}</span>}
                {url && <span className="pb-accent mt-4 inline-flex items-center gap-1 text-sm font-bold"><ArrowRight className="h-4 w-4" aria-hidden /></span>}
              </span>
            </>
          );
          const cls = cn('group block h-full overflow-hidden rounded-2xl border', custom.className ?? (dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white text-zinc-900 shadow-sm'));
          return <li key={i}>{url ? <CmsLink href={url} className={cn(cls, 'transition-shadow hover:shadow-lg')} style={custom.style}>{card}</CmsLink> : <div className={cls} style={custom.style}>{card}</div>}</li>;
        })}
      </ul>
    </SectionShell>
  );
}
