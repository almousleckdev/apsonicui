'use client';

import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, MessageSquareQuote, Plus, Trash2 } from 'lucide-react';
import { TestimonialCard } from '@/components/features/testimonial-card';
import { TestimonialPhotoUpload } from '@/components/admin/homepage/TestimonialPhotoUpload';
import {
  TESTIMONIAL_LIMITS,
  addTestimonial,
  moveTestimonial,
  patchTestimonial,
  removeTestimonial,
  resolveTestimonial,
  type TestimonialErrors,
  type TestimonialLocale,
} from '@/lib/homepage/testimonials';
import type { HomeTestimonialItem } from '@/lib/types/homepage';

interface TestimonialsEditorProps {
  testimonials: HomeTestimonialItem[];
  /** Receives a function of the latest list (not a snapshot), so slow actions never overwrite newer edits. */
  onChange: (update: (current: HomeTestimonialItem[]) => HomeTestimonialItem[]) => void;
  /** Whether the section is shown on the public homepage. */
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  /** Validation problems by testimonial id; displayed once the admin has tried to save. */
  errors: Record<string, TestimonialErrors>;
  showErrors: boolean;
}

const LANGUAGES: { code: TestimonialLocale; label: string; suffix: 'En' | 'Fr' | 'Zh' }[] = [
  { code: 'en', label: 'English', suffix: 'En' },
  { code: 'fr', label: 'Français', suffix: 'Fr' },
  { code: 'zh', label: '中文', suffix: 'Zh' },
];

const fieldClass =
  'w-full px-3 py-2 border rounded-xl bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green/25 focus:border-brand-green/50';

const Counter: React.FC<{ value: string; max: number }> = ({ value, max }) => (
  <span className={`text-2xs tabular-nums ${value.length > max ? 'font-bold text-red-600' : 'text-zinc-400'}`}>
    {value.length}/{max}
  </span>
);

export const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({
  testimonials,
  onChange,
  visible,
  onVisibleChange,
  errors,
  showErrors,
}) => {
  const { t } = useAdminText();
  const [lang, setLang] = useState<TestimonialLocale>('en');
  // Folded by default to keep the page short; opens by itself when saving found problems here.
  const [openByUser, setOpenByUser] = useState(false);
  const open = openByUser || showErrors;
  const suffix = LANGUAGES.find((l) => l.code === lang)!.suffix;
  const langLabel = LANGUAGES.find((l) => l.code === lang)!.label;
  const atLimit = testimonials.length >= TESTIMONIAL_LIMITS.maxItems;

  const update = (id: string, patch: Partial<HomeTestimonialItem>) => onChange((current) => patchTestimonial(current, id, patch));

  return (
    <section id="testimonials-section" className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm space-y-4 font-sans scroll-mt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <button type="button" aria-expanded={open} onClick={() => setOpenByUser((o) => !o)} className="flex items-center gap-2 text-left cursor-pointer min-w-0">
          <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${open ? '' : '-rotate-90'}`} />
          <MessageSquareQuote className="h-4 w-4 shrink-0 text-brand-green" />
          <h2 className="text-sm font-black text-zinc-900"><T id="home.testimonials.title" /></h2>
          <span className="text-2xs font-medium text-zinc-400 truncate">
            {t('home.testimonials.count', { count: testimonials.length })}
          </span>
        </button>

        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <span className="text-xs font-bold text-zinc-700"><T id="home.testimonials.show" /></span>
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              onClick={() => onVisibleChange(!visible)}
              className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green/40 cursor-pointer ${visible ? 'bg-brand-green' : 'bg-zinc-300'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${visible ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </label>
          <button
            type="button"
            onClick={() => {
              setOpenByUser(true);
              onChange(addTestimonial);
            }}
            disabled={atLimit}
            title={atLimit ? t('home.testimonials.maximum', { max: TESTIMONIAL_LIMITS.maxItems }) : undefined}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white font-bold text-2xs rounded-lg hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" /> <T id="home.testimonials.add" />
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-4">
      {!visible && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800">
          <T id="home.testimonials.hiddenNote" />
        </p>
      )}

      {/* Language of the texts being edited and previewed */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-zinc-700"><T id="home.testimonials.editingIn" /></span>
        <div role="tablist" aria-label={t('common.language')} className="inline-flex rounded-xl bg-zinc-100 p-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="tab"
              aria-selected={lang === l.code}
              onClick={() => setLang(l.code)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${lang === l.code ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <span className="text-2xs text-zinc-500"><T id="home.testimonials.sameEverywhere" /></span>
      </div>

      {/* List */}
      {testimonials.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 px-6 py-12 text-center">
          <p className="text-sm font-bold text-zinc-700"><T id="home.testimonials.emptyTitle" /></p>
          <p className="mt-1 text-xs text-zinc-500"><T id="home.testimonials.emptyText" /></p>
        </div>
      ) : (
        <div className="space-y-5">
          {testimonials.map((item, index) => {
            const itemErrors = showErrors ? errors[item.id] : undefined;
            const roleKey = `role${suffix}` as const;
            const quoteKey = `quote${suffix}` as const;
            const role = item[roleKey] ?? '';
            const quote = item[quoteKey] ?? '';
            const preview = resolveTestimonial(item, lang);
            const usingEnglishFallback = lang !== 'en' && !quote.trim() && !!(item.quoteEn ?? '').trim();

            return (
              <article key={item.id} className="grid gap-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 sm:p-5 lg:grid-cols-2">
                {/* Form */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-extrabold uppercase tracking-widest text-zinc-400"><T id="home.testimonials.item" values={{ number: index + 1 }} /></span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => onChange((current) => moveTestimonial(current, item.id, -1))} disabled={index === 0} aria-label={t('home.testimonials.moveUp')} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200/70 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => onChange((current) => moveTestimonial(current, item.id, 1))} disabled={index === testimonials.length - 1} aria-label={t('home.testimonials.moveDown')} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200/70 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange((current) => removeTestimonial(current, item.id))}
                        aria-label={t('home.testimonials.remove', { number: index + 1 })}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <TestimonialPhotoUpload value={item.image} name={item.name} onChange={(url) => update(item.id, { image: url })} />
                  {itemErrors?.image && <p className="text-2xs font-medium text-red-600"><T id={itemErrors.image.key} values={itemErrors.image.values} /></p>}

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor={`t-name-${item.id}`} className="text-xs font-bold text-zinc-700"><T id="home.testimonials.name" /> *</label>
                      <Counter value={item.name} max={TESTIMONIAL_LIMITS.name} />
                    </div>
                    <input
                      id={`t-name-${item.id}`}
                      type="text"
                      value={item.name}
                      onChange={(e) => update(item.id, { name: e.target.value })}
                      placeholder={t('home.testimonials.namePlaceholder')}
                      aria-invalid={!!itemErrors?.name}
                      className={`${fieldClass} ${itemErrors?.name ? 'border-red-400' : 'border-zinc-200'}`}
                    />
                    {itemErrors?.name && <p className="mt-1 text-2xs font-medium text-red-600"><T id={itemErrors.name.key} values={itemErrors.name.values} /></p>}
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor={`t-role-${item.id}`} className="text-xs font-bold text-zinc-700"><T id="home.testimonials.role" values={{ language: langLabel }} /></label>
                      <Counter value={role} max={TESTIMONIAL_LIMITS.role} />
                    </div>
                    <input
                      id={`t-role-${item.id}`}
                      type="text"
                      value={role}
                      onChange={(e) => update(item.id, { [roleKey]: e.target.value })}
                      placeholder={t(`home.testimonials.rolePlaceholder.${lang}`)}
                      aria-invalid={!!itemErrors?.[roleKey]}
                      className={`${fieldClass} ${itemErrors?.[roleKey] ? 'border-red-400' : 'border-zinc-200'}`}
                    />
                    <CopyFromLanguage current={lang} values={{ en: item.roleEn, fr: item.roleFr, zh: item.roleZh }} onCopy={(text) => update(item.id, { [roleKey]: text })} />
                    {itemErrors?.[roleKey] && <p className="mt-1 text-2xs font-medium text-red-600"><T id={itemErrors[roleKey]!.key} values={itemErrors[roleKey]!.values} /></p>}
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor={`t-quote-${item.id}`} className="text-xs font-bold text-zinc-700">
                        <T id="home.testimonials.quote" values={{ language: langLabel }} />{lang === 'en' && ' *'}
                      </label>
                      <Counter value={quote} max={TESTIMONIAL_LIMITS.quote} />
                    </div>
                    <textarea
                      id={`t-quote-${item.id}`}
                      rows={5}
                      value={quote}
                      onChange={(e) => update(item.id, { [quoteKey]: e.target.value })}
                      placeholder={t('home.testimonials.quotePlaceholder')}
                      aria-invalid={!!itemErrors?.[quoteKey]}
                      className={`${fieldClass} resize-y leading-relaxed ${itemErrors?.[quoteKey] ? 'border-red-400' : 'border-zinc-200'}`}
                    />
                    <CopyFromLanguage current={lang} values={{ en: item.quoteEn, fr: item.quoteFr, zh: item.quoteZh }} onCopy={(text) => update(item.id, { [quoteKey]: text })} />
                    {itemErrors?.[quoteKey] && <p className="mt-1 text-2xs font-medium text-red-600"><T id={itemErrors[quoteKey]!.key} values={itemErrors[quoteKey]!.values} /></p>}
                    {usingEnglishFallback && (
                      <p className="mt-1 text-2xs font-medium text-amber-700"><T id="home.testimonials.noTranslation" values={{ language: langLabel }} /></p>
                    )}
                  </div>
                  {showErrors && itemErrors?.quoteEn && lang !== 'en' && (
                    <p className="text-2xs font-medium text-red-600"><T id={itemErrors.quoteEn.key} values={itemErrors.quoteEn.values} /> <T id="home.testimonials.fillEnglish" /></p>
                  )}
                </div>

                {/* Live preview: the same card the homepage renders */}
                <div className="flex flex-col">
                  <span className="mb-2 text-2xs font-extrabold uppercase tracking-widest text-zinc-400"><T id="home.testimonials.preview" values={{ language: langLabel }} /></span>
                  <div className="flex-1 rounded-2xl bg-white p-4 border border-zinc-100">
                    {preview ? (
                      <div className="mx-auto max-w-md">
                        <TestimonialCard quote={preview.quote} name={preview.name} role={preview.role} image={preview.image} />
                      </div>
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 text-center text-xs text-zinc-400">
                        <T id="home.testimonials.previewEmpty" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
        </div>
      )}
    </section>
  );
};
