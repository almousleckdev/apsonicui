'use client';

import React from 'react';
import { Award, Bike, Check, Clock, Globe, Heart, Leaf, MapPin, Phone, Settings, Shield, Star, Truck, Users, Wrench, Zap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyHint, SectionHeading, SectionShell, isDark, list, str, text, type SectionProps } from '../shared';

const ICONS: Record<string, LucideIcon> = {
  shield: Shield, truck: Truck, wrench: Wrench, zap: Zap, award: Award, globe: Globe, users: Users, check: Check,
  star: Star, clock: Clock, 'map-pin': MapPin, phone: Phone, heart: Heart, settings: Settings, leaf: Leaf, bike: Bike,
};
const COLUMNS: Record<string, string> = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3', '4': 'sm:grid-cols-2 lg:grid-cols-4' };

export function FeatureGrid({ section, ctx }: SectionProps) {
  const c = section.content;
  const items = list(c, 'items').filter((i) => text(i, 'title', ctx.locale));
  const dark = isDark(section.style);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Feature grid: add cards in the panel.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={dark} />
      <ul className={cn('grid grid-cols-1 gap-6', COLUMNS[str(c, 'columns') || '3'])}>
        {items.map((item, i) => {
          const Icon = ICONS[str(item, 'icon')] ?? Check;
          const body = text(item, 'text', ctx.locale);
          return (
            <li key={i} className={cn('rounded-2xl border p-7', dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white shadow-sm')}>
              <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl', dark ? 'bg-white/10 text-white' : 'bg-brand-green/10 text-brand-green')}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-extrabold">{text(item, 'title', ctx.locale)}</h3>
              {body && <p className={cn('mt-2 text-sm leading-relaxed', dark ? 'text-white/75' : 'text-zinc-600')}>{body}</p>}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
