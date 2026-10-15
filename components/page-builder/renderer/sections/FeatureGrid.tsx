'use client';

import React from 'react';
import { Award, Bike, Check, Clock, Globe, Heart, Leaf, MapPin, Phone, Settings, Shield, Star, Truck, Users, Wrench, Zap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { CmsLink, EmptyHint, SectionHeading, SectionShell, cardProps, list, pick, str, text, type SectionProps } from '../shared';

export const ICONS: Record<string, LucideIcon> = {
  shield: Shield, truck: Truck, wrench: Wrench, zap: Zap, award: Award, globe: Globe, users: Users, check: Check,
  star: Star, clock: Clock, 'map-pin': MapPin, phone: Phone, heart: Heart, settings: Settings, leaf: Leaf, bike: Bike,
};
const COLUMNS = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4' } as const;
const ICON_SHAPE = { square: 'h-12 w-12 rounded-xl', circle: 'h-12 w-12 rounded-full', plain: 'h-10 w-10' } as const;

export function FeatureGrid({ section, ctx }: SectionProps) {
  const c = section.content;
  const r = resolveStyle(section.style);
  const items = list(c, 'items').filter((i) => text(i, 'title', ctx.locale));
  const card = pick(c.cardStyle, ['boxed', 'filled', 'plain'] as const, 'boxed');
  const center = c.align === 'center';
  const iconShape = pick(c.iconStyle, ['square', 'circle', 'plain'] as const, 'square');
  const custom = cardProps(c.cardColor);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Feature grid: add cards in the panel.</EmptyHint>;

  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={r.dark} />
      <ul className={cn('grid grid-cols-1 gap-6', COLUMNS[pick(c.columns, ['2', '3', '4'] as const, '3')])}>
        {items.map((item, i) => {
          const Icon = ICONS[str(item, 'icon')] as LucideIcon | undefined;
          const body = text(item, 'text', ctx.locale);
          const url = str(item, 'url');
          const inner = (
            <>
              {Icon && (
                <span className={cn('flex items-center justify-center', ICON_SHAPE[iconShape], center && 'mx-auto', iconShape !== 'plain' && 'bg-[color-mix(in_srgb,var(--pb-accent,#00a651)_14%,transparent)]')}>
                  <Icon className="pb-accent h-6 w-6" aria-hidden />
                </span>
              )}
              <h3 className={cn('text-lg font-extrabold', Icon && 'mt-5')}>{text(item, 'title', ctx.locale)}</h3>
              {body && <p className="mt-2 text-sm leading-relaxed opacity-75">{body}</p>}
            </>
          );
          const cls = cn('block h-full', center && 'text-center', card !== 'plain' && 'rounded-2xl p-7',
            !custom.className && card === 'boxed' && (r.dark ? 'border border-white/15 bg-white/5' : 'border border-zinc-100 bg-white text-zinc-900 shadow-sm'),
            !custom.className && card === 'filled' && (r.dark ? 'bg-white/10' : 'bg-zinc-50 text-zinc-900'),
            custom.className);
          return (
            <li key={i}>
              {url ? <CmsLink href={url} className={cn(cls, 'transition-shadow hover:shadow-lg')} style={custom.style}>{inner}</CmsLink> : <div className={cls} style={custom.style}>{inner}</div>}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
