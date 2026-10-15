'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { safeColor } from '@/lib/page-builder/colors';
import { EmptyHint, SectionHeading, SectionShell, cardProps, list, pick, str, text, type SectionProps } from '../shared';
import type { LucideIcon } from 'lucide-react';
import { ICONS } from './FeatureGrid';

const COLUMNS = {
  auto: '',
  '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4', '6': 'sm:grid-cols-3 lg:grid-cols-6',
} as const;
const VALUE = { md: 'text-3xl sm:text-4xl', lg: 'text-4xl sm:text-5xl', xl: 'text-5xl sm:text-6xl' } as const;

export function Stats({ section, ctx }: SectionProps) {
  const c = section.content;
  const r = resolveStyle(section.style);
  const items = list(c, 'items').filter((i) => str(i, 'value'));
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Statistics: add figures in the panel.</EmptyHint>;
  const columns = pick(c.columns, ['auto', '2', '3', '4', '6'] as const, 'auto');
  const auto = items.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : items.length === 3 ? 'sm:grid-cols-3' : items.length === 2 ? 'sm:grid-cols-2' : '';
  const left = c.align === 'left';
  const card = pick(c.cardStyle, ['plain', 'boxed', 'filled'] as const, 'plain');
  const custom = cardProps(c.cardColor);
  const valueColor = safeColor(c.valueColor);
  const labelColor = safeColor(c.labelColor);

  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={r.dark} />
      <dl className={cn('grid grid-cols-2 gap-6 sm:gap-8', columns === 'auto' ? auto : COLUMNS[columns], left ? 'text-left' : 'text-center')}>
        {items.map((item, i) => {
          const Icon = ICONS[str(item, 'icon')] as LucideIcon | undefined;
          const own = safeColor(item.color) ?? valueColor;
          const note = text(item, 'note', ctx.locale);
          return (
            <div key={i} className={cn('flex flex-col', left ? 'items-start' : 'items-center', card !== 'plain' && 'rounded-2xl p-6',
              !custom.className && card === 'boxed' && (r.dark ? 'border border-white/15' : 'border border-zinc-200'),
              !custom.className && card === 'filled' && (r.dark ? 'bg-white/10' : 'bg-zinc-50'), custom.className)} style={custom.style}>
              {Icon && <Icon className={cn('mb-3 h-7 w-7', !own && 'pb-accent')} style={own ? { color: own } : undefined} aria-hidden />}
              <dd className={cn('font-black tracking-tight', VALUE[pick(c.valueSize, ['md', 'lg', 'xl'] as const, 'lg')], own ? 'pb-own' : 'pb-accent')}
                style={own ? ({ ['--pb-own' as string]: own } as React.CSSProperties) : undefined}>{str(item, 'value')}</dd>
              <dt className={cn('mt-2 text-sm font-semibold uppercase tracking-wider', labelColor ? 'pb-own' : 'opacity-75')}
                style={labelColor ? ({ ['--pb-own' as string]: labelColor } as React.CSSProperties) : undefined}>{text(item, 'label', ctx.locale)}</dt>
              {note && <p className="mt-1 text-xs opacity-60">{note}</p>}
            </div>
          );
        })}
      </dl>
    </SectionShell>
  );
}
