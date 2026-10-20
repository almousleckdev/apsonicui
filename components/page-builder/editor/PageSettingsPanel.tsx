'use client';

import React, { useEffect, useId, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import { LOCALES } from '@/lib/page-builder/types';
import { pagesService } from '@/services/pages';
import { cn } from '@/lib/utils';
import { setMeta, setSeo } from '@/lib/page-builder/document';
import type { Locale, PageDocument, PageMeta } from '@/lib/page-builder/types';
import { INPUT_CLASS } from './fields/FieldControl';
import { FooterPlacement } from './FooterPlacement';

interface Props {
  pageId: number;
  doc: PageDocument;
  slug: string;
  everPublished: boolean;
  locale: Locale;
  issues: Map<string, string>;
  onSlugChange: (slug: string) => void;
  edit: (change: (doc: PageDocument) => PageDocument, groupKey?: string) => void;
}

/** Page-level settings: title, address, search and social sharing. Shown when no section is selected. */
export function PageSettingsPanel({ pageId, doc, slug, everPublished, locale, issues, onSlugChange, edit }: Props) {
  const { t } = useAdminText();
  const meta: PageMeta = doc.meta[locale] ?? {};
  const english = doc.meta.en ?? {};
  const placeholderFor = (key: keyof PageMeta) => (locale !== 'en' ? english[key] : undefined);
  const metaField = (key: keyof PageMeta, value: string) => edit((d) => setMeta(d, locale, key, value), `meta:${locale}:${key}`);
  /** The text of one setting in every language, for the "copy from" buttons. */
  const inEveryLanguage = (key: keyof PageMeta) => Object.fromEntries(LOCALES.map((l) => [l, doc.meta[l]?.[key]])) as Partial<Record<Locale, string>>;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-extrabold text-zinc-900"><T id="editor.settingsPanel.title" /></h2>
        <p className="text-2xs text-zinc-500"><T id="editor.settingsPanel.hint" /></p>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <Group title={<T id="editor.settingsPanel.page" />}>
          <TextField label={<T id="editor.settingsPanel.pageTitle" />} required copyValues={inEveryLanguage('title')} locale={locale} value={meta.title ?? ''} placeholder={placeholderFor('title')} maxLength={150}
            error={issues.get(`meta.${locale}.title`)} onChange={(v) => metaField('title', v)}
            help={t(locale === 'en' ? 'editor.settingsPanel.pageTitleHelpEn' : 'editor.settingsPanel.pageTitleHelpOther')} />
          <SlugField pageId={pageId} slug={slug} everPublished={everPublished} onChange={onSlugChange} />
        </Group>

        <FooterPlacement pageId={pageId} />

        <Group title={<T id="editor.settingsPanel.searchEngines" />}>
          <TextField label={<T id="editor.settingsPanel.searchTitle" />} copyValues={inEveryLanguage('seoTitle')} locale={locale} value={meta.seoTitle ?? ''} placeholder={placeholderFor('seoTitle') ?? meta.title} maxLength={120} recommended={60}
            error={issues.get(`meta.${locale}.seoTitle`)} onChange={(v) => metaField('seoTitle', v)} />
          <TextField label={<T id="editor.settingsPanel.searchDescription" />} multiline copyValues={inEveryLanguage('seoDescription')} locale={locale} value={meta.seoDescription ?? ''} placeholder={placeholderFor('seoDescription')} maxLength={320} recommended={160}
            error={issues.get(`meta.${locale}.seoDescription`)} onChange={(v) => metaField('seoDescription', v)} />
          <TextField label={<T id="editor.settingsPanel.canonical" />} value={doc.seo.canonicalUrl ?? ''} placeholder="https://www.example.com/page"
            error={issues.get('seo.canonicalUrl')} onChange={(v) => edit((d) => setSeo(d, 'canonicalUrl', v.trim()), 'seo:canonical')}
            help={t('editor.settingsPanel.canonicalHelp')} />
          <Switch label={<T id="editor.settingsPanel.hideFromSearch" />} checked={doc.seo.noIndex === true} onChange={(on) => edit((d) => setSeo(d, 'noIndex', on))} />
        </Group>

        <Group title={<T id="editor.settingsPanel.social" />}>
          <TextField label={<T id="editor.settingsPanel.shareTitle" />} copyValues={inEveryLanguage('ogTitle')} locale={locale} value={meta.ogTitle ?? ''} placeholder={placeholderFor('ogTitle') ?? meta.seoTitle ?? meta.title} maxLength={120}
            error={issues.get(`meta.${locale}.ogTitle`)} onChange={(v) => metaField('ogTitle', v)} />
          <TextField label={<T id="editor.settingsPanel.shareDescription" />} multiline copyValues={inEveryLanguage('ogDescription')} locale={locale} value={meta.ogDescription ?? ''} placeholder={placeholderFor('ogDescription') ?? meta.seoDescription} maxLength={320}
            error={issues.get(`meta.${locale}.ogDescription`)} onChange={(v) => metaField('ogDescription', v)} />
          <div>
            <p className="mb-1 text-xs font-bold text-zinc-700"><T id="editor.settingsPanel.shareImage" /></p>
            <CompactMediaField value={doc.seo.ogImage ?? ''} onChange={(url) => edit((d) => setSeo(d, 'ogImage', url))} />
            {issues.get('seo.ogImage') && <p role="alert" className="mt-1 text-2xs font-semibold text-red-600">{issues.get('seo.ogImage')}</p>}
          </div>
        </Group>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-2xs font-extrabold uppercase tracking-[0.15em] text-zinc-400">{title}</legend>
      {children}
    </fieldset>
  );
}

function TextField({ label, value, onChange, placeholder, maxLength, recommended, multiline, required, error, help, copyValues, locale }: {
  label: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; recommended?: number;
  multiline?: boolean; required?: boolean; error?: string; help?: string;
  /** The same setting in every language; with {@link locale} it adds the "copy from" buttons. */
  copyValues?: Partial<Record<Locale, string>>; locale?: Locale;
}) {
  const id = useId();
  const { t } = useAdminText();
  const over = recommended !== undefined && value.length > recommended;
  return (
    <div>
      <label htmlFor={id} className="mb-1 flex items-baseline justify-between text-xs font-bold text-zinc-700">
        <span>{label}{required && <span className="ml-0.5 text-red-500" aria-label={t('editor.field.required')}>*</span>}</span>
        {recommended !== undefined && value.length > 0 && <span className={cn('font-medium', over ? 'text-amber-600' : 'text-zinc-400')}>{value.length}/{recommended}</span>}
      </label>
      {multiline
        ? <textarea id={id} rows={3} value={value} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} className={cn(INPUT_CLASS, 'resize-y')} aria-invalid={!!error} />
        : <input id={id} type="text" value={value} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} className={INPUT_CLASS} aria-invalid={!!error} />}
      {copyValues && locale && <CopyFromLanguage current={locale} values={copyValues} onCopy={onChange} />}
      {help && !error && <p className="mt-1 text-2xs text-zinc-400">{help}</p>}
      {error && <p role="alert" className="mt-1 text-2xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function Switch({ label, checked, onChange }: { label: React.ReactNode; checked: boolean; onChange: (on: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span id={id} className="text-xs font-bold text-zinc-700">{label}</span>
      <button type="button" role="switch" aria-checked={checked} aria-labelledby={id} onClick={() => onChange(!checked)}
        className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', checked ? 'bg-brand-green' : 'bg-zinc-300')}>
        <span className={cn('absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-4')} />
      </button>
    </div>
  );
}

type Availability = 'idle' | 'checking' | 'free' | 'taken';

export function SlugField({ pageId, slug, everPublished = false, onChange, label }: { pageId?: number; slug: string; everPublished?: boolean; onChange: (v: string) => void; label?: React.ReactNode }) {
  const id = useId();
  const { t } = useAdminText();
  const [state, setState] = useState<Availability>('idle');
  const empty = slug.length === 0;
  const valid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setState('checking');
      pagesService.slugAvailable(slug, pageId).then((ok) => { if (!cancelled) setState(ok ? 'free' : 'taken'); }).catch(() => { if (!cancelled) setState('idle'); });
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [slug, valid, pageId]);

  const shown: Availability = valid ? state : 'idle';
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-zinc-700">{label ?? <T id="editor.settingsPanel.pageAddress" />}</label>
      <div className="flex items-center overflow-hidden rounded-lg border border-zinc-200 bg-white focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20">
        <span className="select-none border-r border-zinc-200 bg-zinc-50 px-2.5 py-2 text-sm text-zinc-400">/</span>
        <input id={id} type="text" value={slug} onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z0-9-]/g, '-'))} maxLength={80}
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none" aria-invalid={(!valid && !empty) || shown === 'taken'} aria-describedby={`${id}-note`} />
        <span className="pr-2.5" aria-hidden>
          {shown === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
          {shown === 'free' && <Check className="h-4 w-4 text-brand-green" />}
          {(shown === 'taken' || (!valid && !empty)) && <X className="h-4 w-4 text-red-500" />}
        </span>
      </div>
      <p id={`${id}-note`} className={cn('mt-1 text-2xs', shown === 'taken' || (!valid && !empty) ? 'font-semibold text-red-600' : 'text-zinc-400')} role={shown === 'taken' ? 'alert' : undefined}>
        {t(empty ? 'editor.settingsPanel.addressFromTitle'
          : !valid ? 'editor.settingsPanel.addressInvalid'
          : shown === 'taken' ? 'editor.settingsPanel.addressTaken'
            : everPublished ? 'editor.settingsPanel.addressRedirect'
              : 'editor.settingsPanel.addressHint')}
      </p>
    </div>
  );
}
