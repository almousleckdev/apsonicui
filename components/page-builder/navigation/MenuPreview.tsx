'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { localized } from '@/lib/page-builder/document';
import type { Locale, PageStatus } from '@/lib/page-builder/types';
import type { MenuItem, MenuKey, PageOption } from '@/lib/navigation/types';

interface Props {
  menu: MenuKey;
  items: MenuItem[];
  locale: Locale;
  pages: Map<number, PageOption>;
}

const labelOf = (item: MenuItem, locale: Locale) => localized(item.labels, locale) || '(no label)';

/** A faithful miniature of how the menu will look on the site, built from the unpublished draft. */
export function MenuPreview({ menu, items, locale, pages }: Props) {
  const visible = items.filter((i) => i.visible);
  return (
    <div aria-label={`Preview of the ${menu} menu`} className={cn('rounded-xl px-5 py-3 shadow-inner', menu === 'header' ? 'bg-[#058B4F] text-white' : 'bg-zinc-950 text-white')}>
      {visible.length === 0 ? (
        <p className="py-1 text-xs font-medium text-white/70">Nothing visible yet. Add an item to see it here.</p>
      ) : menu === 'header' ? (
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {visible.map((item) => <HeaderEntry key={item.id} item={item} locale={locale} pages={pages} />)}
        </ul>
      ) : (
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {visible.map((item) => <FooterColumn key={item.id} item={item} locale={locale} pages={pages} />)}
        </div>
      )}
    </div>
  );
}

function pendingNote(item: MenuItem, pages: Map<number, PageOption>): string | null {
  if (item.kind !== 'PAGE' || !item.pageId) return null;
  const status: PageStatus | undefined = pages.get(item.pageId)?.status;
  return status && status !== 'PUBLISHED' ? 'Page not published yet' : null;
}

function HeaderEntry({ item, locale, pages }: { item: MenuItem; locale: Locale; pages: Map<number, PageOption> }) {
  const [open, setOpen] = useState(false);
  const children = item.children.filter((c) => c.visible);
  const note = pendingNote(item, pages);
  return (
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        className={cn('inline-flex items-center gap-1 py-1 text-sm font-medium hover:text-[#FFD700]', note && 'opacity-60')} title={note ?? undefined}>
        {labelOf(item, locale)}
        {(children.length > 0 || (item.kind === 'ROUTE' && item.route === '/products')) && <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />}
      </button>
      {open && children.length > 0 && (
        <ul className="absolute left-0 top-full z-10 mt-1 min-w-48 rounded-lg bg-white py-2 text-zinc-800 shadow-xl">
          {children.map((c) => (
            <li key={c.id}>
              <span className={cn('block px-4 py-1.5 text-sm font-medium', pendingNote(c, pages) && 'opacity-50')}>{labelOf(c, locale)}</span>
              {c.children.filter((g) => g.visible).map((g) => (
                <span key={g.id} className="block px-6 py-1 text-xs text-zinc-500">{labelOf(g, locale)}</span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function FooterColumn({ item, locale, pages }: { item: MenuItem; locale: Locale; pages: Map<number, PageOption> }) {
  const children = item.children.filter((c) => c.visible);
  return (
    <div className="min-w-32">
      <p className={cn('text-xs font-bold uppercase tracking-wider', pendingNote(item, pages) && 'opacity-60')}>{labelOf(item, locale)}</p>
      <ul className="mt-2 space-y-1.5">
        {children.map((c) => <li key={c.id} className="text-xs text-zinc-400">{labelOf(c, locale)}</li>)}
      </ul>
    </div>
  );
}
