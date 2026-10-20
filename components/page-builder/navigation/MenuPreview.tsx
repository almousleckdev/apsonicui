'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { localized } from '@/lib/page-builder/document';
import type { Locale, PageStatus } from '@/lib/page-builder/types';
import type { MenuItem, MenuKey, PageOption } from '@/lib/navigation/types';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface Props {
  menu: MenuKey;
  items: MenuItem[];
  locale: Locale;
  pages: Map<number, PageOption>;
}

const labelOf = (item: MenuItem, locale: Locale) => localized(item.labels, locale);

/** A faithful miniature of how the menu will look on the site, built from the unpublished draft. */
export function MenuPreview({ menu, items, locale, pages }: Props) {
  const visible = items.filter((i) => i.visible);
  const { t } = useAdminText();
  return (
    <div aria-label={t('navigation.preview.label', { menu: t(menu === 'header' ? 'navigation.menuName.header' : 'navigation.menuName.footer') })} className={cn('rounded-xl px-5 py-3 shadow-inner', menu === 'header' ? 'bg-[#058B4F] text-white' : 'bg-zinc-950 text-white')}>
      {visible.length === 0 ? (
        <p className="py-1 text-xs font-medium text-white/70"><T id="navigation.preview.empty" /></p>
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

function isPending(item: MenuItem, pages: Map<number, PageOption>): boolean {
  if (item.kind !== 'PAGE' || !item.pageId) return false;
  const status: PageStatus | undefined = pages.get(item.pageId)?.status;
  return !!status && status !== 'PUBLISHED';
}

function HeaderEntry({ item, locale, pages }: { item: MenuItem; locale: Locale; pages: Map<number, PageOption> }) {
  const [open, setOpen] = useState(false);
  const children = item.children.filter((c) => c.visible);
  const { t } = useAdminText();
  const pending = isPending(item, pages);
  return (
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        className={cn('inline-flex items-center gap-1 py-1 text-sm font-medium hover:text-[#FFD700]', pending && 'opacity-60')} title={pending ? t('navigation.preview.pageNotPublished') : undefined}>
        {labelOf(item, locale) || <T id="navigation.preview.noLabel" />}
        {(children.length > 0 || (item.kind === 'ROUTE' && item.route === '/products')) && <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />}
      </button>
      {open && children.length > 0 && (
        <ul className="absolute left-0 top-full z-10 mt-1 min-w-48 rounded-lg bg-white py-2 text-zinc-800 shadow-xl">
          {children.map((c) => (
            <li key={c.id}>
              <span className={cn('block px-4 py-1.5 text-sm font-medium', isPending(c, pages) && 'opacity-50')}>{labelOf(c, locale) || <T id="navigation.preview.noLabel" />}</span>
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
      <p className={cn('text-xs font-bold uppercase tracking-wider', isPending(item, pages) && 'opacity-60')}>{labelOf(item, locale) || <T id="navigation.preview.noLabel" />}</p>
      <ul className="mt-2 space-y-1.5">
        {children.map((c) => <li key={c.id} className="text-xs text-zinc-400">{labelOf(c, locale)}</li>)}
      </ul>
    </div>
  );
}
