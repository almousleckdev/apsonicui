'use client';

import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { EmptyHint, SectionHeading, SectionShell, cardProps, list, pick, str, text, type SectionProps } from '../shared';

const COLUMNS = { '2': 'sm:grid-cols-2', '3': 'sm:grid-cols-2 lg:grid-cols-3' } as const;

export function Dealers({ section, ctx }: SectionProps) {
  const c = section.content;
  const dark = resolveStyle(section.style).dark;
  const items = list(c, 'items').filter((i) => str(i, 'name'));
  const custom = cardProps(c.cardColor);
  if (items.length === 0) return <EmptyHint editing={ctx.editing}>Dealers: add locations in the panel.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={dark} />
      <ul className={cn('grid grid-cols-1 gap-6', COLUMNS[pick(c.columns, ['2', '3'] as const, '3')])}>
        {items.map((d, i) => {
          const place = [str(d, 'city'), str(d, 'country')].filter(Boolean).join(', ');
          const address = text(d, 'address', ctx.locale);
          const phone = str(d, 'phone');
          const email = str(d, 'email');
          const map = str(d, 'mapUrl');
          return (
            <li key={i} className={cn('rounded-2xl border p-6', custom.className ?? (dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white text-zinc-900 shadow-sm'))} style={custom.style}>
              <h3 className="text-lg font-extrabold">{str(d, 'name')}</h3>
              {place && <p className="pb-accent mt-0.5 text-sm font-semibold">{place}</p>}
              <ul className="mt-4 space-y-2 text-sm">
                {address && <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-60" aria-hidden /><span className="whitespace-pre-line">{address}</span></li>}
                {phone && <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 opacity-60" aria-hidden /><a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:underline">{phone}</a></li>}
                {email && <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 opacity-60" aria-hidden /><a href={`mailto:${email}`} className="break-all hover:underline">{email}</a></li>}
              </ul>
              {map && <a href={map} target="_blank" rel="noopener noreferrer" className="pb-accent mt-4 inline-block text-sm font-bold hover:underline">Map</a>}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
