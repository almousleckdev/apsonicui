'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyHint, SectionHeading, SectionShell, isDark, list, text, type SectionProps } from '../shared';

export function Faq({ section, ctx }: SectionProps) {
  const c = section.content;
  const items = list(c, 'items').filter((i) => text(i, 'question', ctx.locale));
  const dark = isDark(section.style);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>FAQ: add questions in the panel.</EmptyHint>;
  return (
    <SectionShell section={section} className="max-w-3xl">
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={dark} />
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className={cn('group rounded-2xl border', dark ? 'border-white/15 bg-white/5' : 'border-zinc-200 bg-white')}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-left text-base font-bold [&::-webkit-details-marker]:hidden">
              {text(item, 'question', ctx.locale)}
              <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className={cn('prose max-w-none px-6 pb-5', dark && 'prose-invert [&_*]:!text-inherit')} dangerouslySetInnerHTML={{ __html: text(item, 'answer', ctx.locale) }} />
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
