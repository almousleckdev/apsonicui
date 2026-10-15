'use client';

import React from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { Buttons, EmptyHint, SectionHeading, SectionShell, bool, str, text, type SectionProps } from '../shared';

export function ContactBlock({ section, ctx }: SectionProps) {
  const c = section.content;
  const dark = resolveStyle(section.style).dark;
  const email = str(c, 'email');
  const phone = str(c, 'phone');
  const address = text(c, 'address', ctx.locale);
  const hours = text(c, 'hours', ctx.locale);
  if (!email && !phone && !address && !hours) return <EmptyHint editing={ctx.editing}>Contact details: add an email, phone or address.</EmptyHint>;

  const rows = [
    { Icon: Mail, value: email, href: `mailto:${email}` },
    { Icon: Phone, value: phone, href: `tel:${phone.replace(/[^+\d]/g, '')}` },
    { Icon: MapPin, value: address },
    { Icon: Clock, value: hours },
  ].filter((r) => r.value);
  const label = ctx.locale === 'fr' ? 'Nous écrire' : ctx.locale === 'zh' ? '联系我们' : 'Send us a message';

  return (
    <SectionShell section={section} className="max-w-3xl">
      <SectionHeading title={text(c, 'heading', ctx.locale)} intro={text(c, 'intro', ctx.locale)} dark={dark} />
      <ul className="space-y-4">
        {rows.map(({ Icon, value, href }, i) => (
          <li key={i} className={cn('flex items-start gap-4 rounded-2xl border p-5', dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white text-zinc-900 shadow-sm')}>
            <span className="pb-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--pb-accent,#00a651)_14%,transparent)]"><Icon className="h-5 w-5" aria-hidden /></span>
            {href ? <a href={href} className="self-center break-all font-semibold hover:underline">{value}</a> : <span className="self-center whitespace-pre-line font-semibold">{value}</span>}
          </li>
        ))}
      </ul>
      {bool(c, 'showFormLink', true) && <Buttons items={[{ label: { en: label }, url: '/contact' }]} section={section} ctx={{ ...ctx, locale: 'en' }} className="mt-8 justify-center" />}
    </SectionShell>
  );
}
