'use client';

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
          <h2 className="text-sm font-black text-zinc-900">Testimonials</h2>
          <span className="text-2xs font-medium text-zinc-400 truncate">
            {testimonials.length} item{testimonials.length === 1 ? '' : 's'} &middot; &ldquo;Voices of the Continent&rdquo;
          </span>
        </button>

        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <span className="text-xs font-bold text-zinc-700">Show on homepage</span>
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
            title={atLimit ? `Maximum ${TESTIMONIAL_LIMITS.maxItems} testimonials` : undefined}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white font-bold text-2xs rounded-lg hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-4">
      {!visible && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800">
          This section is hidden on the homepage. Your testimonials are kept; switch it on to show them again.
        </p>
      )}

      {/* Language of the texts being edited and previewed */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-zinc-700">Editing the texts in:</span>
        <div role="tablist" aria-label="Language" className="inline-flex rounded-xl bg-zinc-100 p-1">
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
        <span className="text-2xs text-zinc-500">Name and photo are the same in every language. If a translation is empty, visitors see the English text.</span>
      </div>

      {/* List */}
      {testimonials.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 px-6 py-12 text-center">
          <p className="text-sm font-bold text-zinc-700">No testimonials yet</p>
          <p className="mt-1 text-xs text-zinc-500">The section stays hidden on the homepage until you add one.</p>
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
                    <span className="text-2xs font-extrabold uppercase tracking-widest text-zinc-400">Testimonial {index + 1}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => onChange((current) => moveTestimonial(current, item.id, -1))} disabled={index === 0} aria-label="Move up" className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200/70 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => onChange((current) => moveTestimonial(current, item.id, 1))} disabled={index === testimonials.length - 1} aria-label="Move down" className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200/70 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange((current) => removeTestimonial(current, item.id))}
                        aria-label={`Remove testimonial ${index + 1}`}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <TestimonialPhotoUpload value={item.image} name={item.name} onChange={(url) => update(item.id, { image: url })} />
                  {itemErrors?.image && <p className="text-2xs font-medium text-red-600">{itemErrors.image}</p>}

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor={`t-name-${item.id}`} className="text-xs font-bold text-zinc-700">Name *</label>
                      <Counter value={item.name} max={TESTIMONIAL_LIMITS.name} />
                    </div>
                    <input
                      id={`t-name-${item.id}`}
                      type="text"
                      value={item.name}
                      onChange={(e) => update(item.id, { name: e.target.value })}
                      placeholder="e.g. Kwame Mensah"
                      aria-invalid={!!itemErrors?.name}
                      className={`${fieldClass} ${itemErrors?.name ? 'border-red-400' : 'border-zinc-200'}`}
                    />
                    {itemErrors?.name && <p className="mt-1 text-2xs font-medium text-red-600">{itemErrors.name}</p>}
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor={`t-role-${item.id}`} className="text-xs font-bold text-zinc-700">Role &amp; country ({langLabel})</label>
                      <Counter value={role} max={TESTIMONIAL_LIMITS.role} />
                    </div>
                    <input
                      id={`t-role-${item.id}`}
                      type="text"
                      value={role}
                      onChange={(e) => update(item.id, { [roleKey]: e.target.value })}
                      placeholder={lang === 'zh' ? '例如：物流企业家，加纳' : lang === 'fr' ? 'p. ex. Entrepreneur en Logistique, Ghana' : 'e.g. Logistics Entrepreneur, Ghana'}
                      aria-invalid={!!itemErrors?.[roleKey]}
                      className={`${fieldClass} ${itemErrors?.[roleKey] ? 'border-red-400' : 'border-zinc-200'}`}
                    />
                    {itemErrors?.[roleKey] && <p className="mt-1 text-2xs font-medium text-red-600">{itemErrors[roleKey]}</p>}
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor={`t-quote-${item.id}`} className="text-xs font-bold text-zinc-700">
                        Quote ({langLabel}){lang === 'en' && ' *'}
                      </label>
                      <Counter value={quote} max={TESTIMONIAL_LIMITS.quote} />
                    </div>
                    <textarea
                      id={`t-quote-${item.id}`}
                      rows={5}
                      value={quote}
                      onChange={(e) => update(item.id, { [quoteKey]: e.target.value })}
                      placeholder="What did this customer say about Apsonic?"
                      aria-invalid={!!itemErrors?.[quoteKey]}
                      className={`${fieldClass} resize-y leading-relaxed ${itemErrors?.[quoteKey] ? 'border-red-400' : 'border-zinc-200'}`}
                    />
                    {itemErrors?.[quoteKey] && <p className="mt-1 text-2xs font-medium text-red-600">{itemErrors[quoteKey]}</p>}
                    {usingEnglishFallback && (
                      <p className="mt-1 text-2xs font-medium text-amber-700">No {langLabel} text yet: visitors using {langLabel} will see the English quote.</p>
                    )}
                  </div>
                  {showErrors && itemErrors?.quoteEn && lang !== 'en' && (
                    <p className="text-2xs font-medium text-red-600">{itemErrors.quoteEn} Switch to English to fill it in.</p>
                  )}
                </div>

                {/* Live preview: the same card the homepage renders */}
                <div className="flex flex-col">
                  <span className="mb-2 text-2xs font-extrabold uppercase tracking-widest text-zinc-400">Preview &middot; {langLabel}</span>
                  <div className="flex-1 rounded-2xl bg-white p-4 border border-zinc-100">
                    {preview ? (
                      <div className="mx-auto max-w-md">
                        <TestimonialCard quote={preview.quote} name={preview.name} role={preview.role} image={preview.image} />
                      </div>
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 text-center text-xs text-zinc-400">
                        Enter a name and an English quote to see the preview. Entries without them are not shown on the homepage.
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
