'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { EmptyHint, SectionHeading, SectionShell, bool, list, text, type SectionProps } from '../shared';

export function Faq({ section, ctx }: SectionProps) {
  const c = section.content;
  const dark = resolveStyle(section.style).dark;
  const items = list(c, 'items').filter((i) => text(i, 'question', ctx.locale));
  const lines = c.style === 'lines';
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>FAQ: add questions in the panel.</EmptyHint>;
  return (
    <SectionShell section={section} className="max-w-3xl">
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={dark} />
      <div className={cn(lines ? 'divide-y divide-current/15 border-y border-current/15' : 'space-y-3')}>
        {items.map((item, i) => (
          <details key={i} open={bool(c, 'openFirst', false) && i === 0 ? true : undefined}
            className={cn('group', !lines && 'rounded-2xl border', !lines && (dark ? 'border-white/15 bg-white/5' : 'border-zinc-200 bg-white text-zinc-900'))}>
            <summary className={cn('flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-bold [&::-webkit-details-marker]:hidden', lines ? 'px-1' : 'px-6')}>
              {text(item, 'question', ctx.locale)}
              <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className={cn('prose max-w-none pb-5', lines ? 'px-1' : 'px-6', dark && 'prose-invert [&_*]:!text-inherit')} dangerouslySetInnerHTML={{ __html: text(item, 'answer', ctx.locale) }} />
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
