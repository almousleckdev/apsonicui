'use client';

import React, { useId } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/page-builder/types';
import { BUILT_IN_ROUTES, type ItemKind, type MenuItem, type PageOption } from '@/lib/navigation/types';
import { INPUT_CLASS } from '../editor/fields/FieldControl';
import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

/** Default wording of the built-in pages, so choosing one fills in all three languages. */
const ROUTE_LABELS: Record<string, Record<Locale, string>> = {
  '/': { en: 'Home', fr: 'Accueil', zh: '首页' },
  '/products': { en: 'Products', fr: 'Produits', zh: '产品' },
  '/services': { en: 'Services', fr: 'Services', zh: '服务' },
  '/news': { en: 'News', fr: 'Actualités', zh: '新闻' },
  '/contact': { en: 'Contact Us', fr: 'Contact', zh: '联系' },
};

const KINDS: Array<{ id: ItemKind; label: AdminKey }> = [
  { id: 'PAGE', label: 'navigation.form.page' },
  { id: 'ROUTE', label: 'navigation.form.route' },
  { id: 'EXTERNAL', label: 'navigation.form.external' },
  { id: 'GROUP', label: 'navigation.form.group' },
];

interface Props {
  item: MenuItem;
  pages: PageOption[];
  /** Page ids and built-in routes already used elsewhere in this menu (one entry per target). */
  usedPageIds: Set<number>;
  usedRoutes: Set<string>;
  issues: string[];
  onChange: (change: (item: MenuItem) => MenuItem) => void;
  onRemove: () => void;
}

/** Everything about one menu entry: where it goes, what it says in each language, and whether it shows. */
export function ItemForm({ item, pages, usedPageIds, usedRoutes, issues, onChange, onRemove }: Props) {
  const id = useId();
  const { t } = useAdminText();

  const setKind = (kind: ItemKind) => {
    if (kind === item.kind) return;
    onChange((i) => ({ ...i, kind, pageId: undefined, route: undefined, url: undefined, openInNewTab: false,
      children: kind === 'EXTERNAL' ? [] : i.children }));
  };
  const setLabel = (locale: Locale, value: string) =>
    onChange((i) => {
      const labels = { ...i.labels };
      if (value === '') delete labels[locale]; else labels[locale] = value;
      return { ...i, labels };
    });

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-1.5 text-xs font-bold text-zinc-700"><T id="navigation.form.opens" /></legend>
        <div role="radiogroup" className="grid grid-cols-4 gap-0.5 rounded-lg bg-zinc-100 p-0.5">
          {KINDS.map((k) => (
            <button key={k.id} type="button" role="radio" aria-checked={item.kind === k.id} onClick={() => setKind(k.id)}
              className={cn('rounded-md px-1 py-1.5 text-2xs font-bold transition-colors', item.kind === k.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}>
              <T id={k.label} />
            </button>
          ))}
        </div>
      </fieldset>

      {item.kind === 'PAGE' && (
        <div>
          <label htmlFor={`${id}-page`} className="mb-1 block text-xs font-bold text-zinc-700"><T id="navigation.form.page" /></label>
          <select id={`${id}-page`} value={item.pageId ?? ''} className={INPUT_CLASS}
            onChange={(e) => {
              const page = pages.find((p) => p.id === Number(e.target.value));
              onChange((i) => ({ ...i, pageId: page?.id, labels: page && !i.labels.en ? { ...i.labels, en: page.title } : i.labels }));
            }}>
            <option value="">{t('navigation.form.choosePage')}</option>
            {pages.map((p) => (
              <option key={p.id} value={p.id} disabled={usedPageIds.has(p.id) && p.id !== item.pageId}>
                {p.title} (/{p.slug}){p.status !== 'PUBLISHED' ? ` · ${t(p.status === 'DRAFT' ? 'common.draft' : 'common.archived')}` : ''}{usedPageIds.has(p.id) && p.id !== item.pageId ? ` · ${t('navigation.form.alreadyUsed')}` : ''}
              </option>
            ))}
          </select>
          <p className="mt-1 text-2xs text-zinc-400"><T id="navigation.form.pageHint" /></p>
        </div>
      )}

      {item.kind === 'ROUTE' && (
        <div>
          <label htmlFor={`${id}-route`} className="mb-1 block text-xs font-bold text-zinc-700"><T id="navigation.form.route" /></label>
          <select id={`${id}-route`} value={item.route ?? ''} className={INPUT_CLASS}
            onChange={(e) => {
              const route = e.target.value || undefined;
              onChange((i) => ({ ...i, route, labels: route && !i.labels.en ? { ...ROUTE_LABELS[route] } : i.labels }));
            }}>
            <option value="">{t('navigation.form.choosePage')}</option>
            {BUILT_IN_ROUTES.map((r) => (
              <option key={r.route} value={r.route} disabled={usedRoutes.has(r.route) && r.route !== item.route}>
                {t(r.label)}{usedRoutes.has(r.route) && r.route !== item.route ? ` · ${t('navigation.form.alreadyUsed')}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {item.kind === 'EXTERNAL' && (
        <div>
          <label htmlFor={`${id}-url`} className="mb-1 block text-xs font-bold text-zinc-700"><T id="navigation.form.webAddress" /></label>
          <input id={`${id}-url`} type="url" inputMode="url" value={item.url ?? ''} placeholder="https://www.example.com"
            onChange={(e) => onChange((i) => ({ ...i, url: e.target.value.trim() || undefined }))} className={INPUT_CLASS} />
        </div>
      )}

      {item.kind === 'GROUP' && (
        <p className="rounded-lg bg-zinc-50 px-3 py-2 text-2xs leading-relaxed text-zinc-500">
          <T id="navigation.form.groupHint" />
        </p>
      )}

      <fieldset className="space-y-2.5">
        <legend className="mb-1 text-xs font-bold text-zinc-700"><T id="navigation.form.label" /></legend>
        {LOCALES.map((locale) => (
          <div key={locale}>
            <label htmlFor={`${id}-${locale}`} className="mb-0.5 flex items-center justify-between text-2xs font-semibold text-zinc-500">
              <span>{LOCALE_LABELS[locale]}{locale === 'en' && <span className="ml-0.5 text-red-500" aria-label={t('editor.field.required')}>*</span>}</span>
              {locale !== 'en' && !item.labels[locale] && <span className="font-medium text-zinc-400"><T id="navigation.form.fallsBack" /></span>}
            </label>
            <input id={`${id}-${locale}`} type="text" value={item.labels[locale] ?? ''} maxLength={60}
              placeholder={locale === 'en' ? t('navigation.form.labelPlaceholder') : item.labels.en}
              onChange={(e) => setLabel(locale, e.target.value)} className={INPUT_CLASS} />
            <CopyFromLanguage current={locale} values={item.labels} onCopy={(text) => setLabel(locale, text)} />
          </div>
        ))}
      </fieldset>

      <div className="space-y-1">
        <Switch label={<T id="navigation.form.showInMenu" />} hint={<T id="navigation.form.showInMenuHint" />} checked={item.visible} onChange={(on) => onChange((i) => ({ ...i, visible: on }))} />
        {(item.kind === 'EXTERNAL' || item.kind === 'PAGE') && (
          <Switch label={<T id="navigation.form.newTab" />} checked={item.openInNewTab} onChange={(on) => onChange((i) => ({ ...i, openInNewTab: on }))} />
        )}
      </div>

      {issues.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-lg bg-red-50 px-3 py-2 text-2xs font-semibold text-red-700">
          {issues.map((m, n) => <li key={n}>{m}</li>)}
        </ul>
      )}

      <button type="button" onClick={onRemove}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
        <Trash2 className="h-3.5 w-3.5" aria-hidden /> <T id={item.children.length > 0 ? 'navigation.form.removeWithDropdown' : 'navigation.form.remove'} />
      </button>
    </div>
  );
}

function Switch({ label, hint, checked, onChange }: { label: React.ReactNode; hint?: React.ReactNode; checked: boolean; onChange: (on: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span>
        <span id={id} className="block text-xs font-bold text-zinc-700">{label}</span>
        {hint && <span className="block text-2xs text-zinc-400">{hint}</span>}
      </span>
      <button type="button" role="switch" aria-checked={checked} aria-labelledby={id} onClick={() => onChange(!checked)}
        className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', checked ? 'bg-brand-green' : 'bg-zinc-300')}>
        <span className={cn('absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-4')} />
      </button>
    </div>
  );
}
