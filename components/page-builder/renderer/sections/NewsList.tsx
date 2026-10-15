'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { newsService } from '@/services/news';
import { cn } from '@/lib/utils';
import { BUTTON_PRIMARY, CmsLink, EmptyHint, SectionHeading, SectionShell, isDark, num, text, type SectionProps } from '../shared';

export function NewsList({ section, ctx }: SectionProps) {
  const c = section.content;
  const limit = num(c, 'limit', 3);
  const dark = isDark(section.style);
  const { data: news = [], isLoading } = useQuery({ queryKey: ['page-news', ctx.locale], queryFn: () => newsService.getNewsList(ctx.locale) });
  const shown = news.slice(0, limit);
  const cta = text(c, 'ctaLabel', ctx.locale);
  if (!isLoading && shown.length === 0) return <EmptyHint editing={ctx.editing}>News: no published articles yet.</EmptyHint>;
  return (
    <SectionShell section={section}>
      <SectionHeading title={text(c, 'heading', ctx.locale)} dark={dark} />
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {shown.map((item) => (
          <li key={item.id}>
            <CmsLink href={`/news/${item.slug}`} className={cn('group flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg', dark ? 'border-white/15 bg-white/5' : 'border-zinc-100 bg-white')}>
              <span className="relative block aspect-[16/10] bg-zinc-100">
                {item.thumbnail && <Image src={item.thumbnail} alt="" fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
              </span>
              <span className="flex flex-1 flex-col p-6">
                <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', dark ? 'text-white/70' : 'text-zinc-500')}>
                  <Calendar className="h-3.5 w-3.5" aria-hidden />{item.date}
                </span>
                <span className="mt-2 block text-lg font-extrabold leading-snug">{item.title}</span>
              </span>
            </CmsLink>
          </li>
        ))}
      </ul>
      {cta && (
        <div className="mt-10 text-center">
          <CmsLink href="/news" className={BUTTON_PRIMARY}>{cta}</CmsLink>
        </div>
      )}
    </SectionShell>
  );
}
