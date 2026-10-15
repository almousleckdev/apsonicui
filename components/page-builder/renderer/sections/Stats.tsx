'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { EmptyHint, SectionHeading, SectionShell, isDark, list, str, text, type SectionProps } from '../shared';

export function Stats({ section, ctx }: SectionProps) {
  const c = section.content;
  const items = list(c, 'items').filter((i) => str(i, 'value'));
  const dark = isDark(section.style);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Statistics: add figures in the panel.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={dark} />
      <dl className={cn('grid grid-cols-2 gap-8 text-center', items.length >= 4 ? 'lg:grid-cols-4' : items.length === 3 ? 'sm:grid-cols-3' : '')}>
        {items.map((item, i) => (
          <div key={i}>
            <dd className={cn('text-4xl font-black tracking-tight sm:text-5xl', dark ? 'text-white' : 'text-brand-green')}>{str(item, 'value')}</dd>
            <dt className={cn('mt-2 text-sm font-semibold uppercase tracking-wider', dark ? 'text-white/80' : 'text-zinc-500')}>{text(item, 'label', ctx.locale)}</dt>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
