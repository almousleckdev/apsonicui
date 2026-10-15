'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { newsService } from '@/services/news';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { Buttons, CmsLink, EmptyHint, SectionHeading, SectionShell, bool, num, pick, text, type SectionProps } from '../shared';

const COLUMNS = { '2': 'md:grid-cols-2', '3': 'md:grid-cols-3' } as const;

export function NewsList({ section, ctx }: SectionProps) {
  const c = section.content;
  const limit = num(c, 'limit', 3);
  const dark = resolveStyle(section.style).dark;
  const { data: news = [], isLoading } = useQuery({ queryKey: ['page-news', ctx.locale], queryFn: () => newsService.getNewsList(ctx.locale) });
  const shown = news.slice(0, limit);
  const cta = text(c, 'ctaLabel', ctx.locale);
  if (!isLoading && shown.length === 0) return <EmptyHint editing={ctx.editing}>News: no published articles yet.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading section={section} ctx={ctx} />
      <ul className={cn('grid grid-cols-1 gap-8', COLUMNS[pick(c.columns, ['2', '3'] as const, '3')])}>
        {shown.map((item) => (
          <li key={item.id}>
            <CmsLink href={`/news/${item.slug}`} className={cn('group flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg', dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white text-zinc-900')}>
              <span className="relative block aspect-[16/10] bg-zinc-100">
                {item.thumbnail && <Image src={item.thumbnail} alt="" fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
              </span>
              <span className="flex flex-1 flex-col p-6">
                {bool(c, 'showDate', true) && (
                  <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', dark ? 'text-white/70' : 'text-zinc-500')}>
                    <Calendar className="h-3.5 w-3.5" aria-hidden />{item.date}
                  </span>
                )}
                <span className="mt-2 block text-lg font-extrabold leading-snug">{item.title}</span>
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
      {cta && <Buttons items={[{ label: { en: cta }, url: '/news' }]} section={section} ctx={{ ...ctx, locale: 'en' }} className="mt-10 justify-center" />}
    </SectionShell>
  );
}
