'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Layers, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useSectionTypes } from '@/hooks/page-builder/useSectionTypes';
import { pagesService } from '@/services/pages';
import { ApiError } from '@/services/api-client';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/errors';
import { isValidSlug, slugify } from '@/lib/page-builder/slug';
import { buildTemplateDocument, PAGE_TEMPLATES } from '@/lib/page-builder/templates';
import { SlugField } from './editor/PageSettingsPanel';
import { INPUT_CLASS } from './editor/fields/FieldControl';
import { T, TServer } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

/**
 * Creating a page takes two decisions: what it is called and what to start from. The address follows the name until
 * the editor changes it. Nothing is published; the page opens in the editor as a private draft.
 */
export function NewPageForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useAdminText();
  const { byType, styleFields, isLoading: loadingSections } = useSectionTypes();

  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState<string | null>(null);
  // The address follows the title until the editor types their own.
  const slug = customSlug ?? slugify(title);
  const [templateId, setTemplateId] = useState('blank');
  const [creating, setCreating] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const canCreate = title.trim().length > 0 && isValidSlug(slug) && !creating && !loadingSections;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    setCreating(true);
    setProblem(null);
    try {
      const template = PAGE_TEMPLATES.find((entry) => entry.id === templateId) ?? PAGE_TEMPLATES[0];
      const page = await pagesService.create({ slug, title: title.trim(), document: buildTemplateDocument(template, title.trim(), byType, styleFields) });
      toast.success(t('newPage.created'));
      router.push(`/admin/pages/${page.id}`);
    } catch (err) {
      const message = getErrorMessage(err, t('newPage.createFailed'));
      setProblem(err instanceof ApiError && err.status === 409 ? t('newPage.addressTaken') : message);
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl font-sans">
      <Link href="/admin/pages" className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" aria-hidden /> <T id="newPage.back" />
      </Link>

      <form onSubmit={submit} className="rounded-2xl border border-zinc-200 bg-white shadow-sm" noValidate>
        <div className="border-b border-zinc-100 px-8 py-6">
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900"><T id="newPage.title" layout="stack" /></h1>
          <p className="mt-1 text-sm text-zinc-500"><T id="newPage.intro" /></p>
        </div>

        <div className="space-y-8 px-8 py-7">
          <section aria-labelledby="step-name" className="space-y-4">
            <StepHeading id="step-name" number={1}><T id="newPage.stepName" /></StepHeading>
            <div>
              <label htmlFor="page-title" className="mb-1.5 block text-sm font-bold text-zinc-800"><T id="newPage.pageTitle" /></label>
              <input id="page-title" type="text" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} placeholder={t('newPage.pageTitlePlaceholder')}
                className={cn(INPUT_CLASS, 'px-4 py-3 text-base')} />
              <p className="mt-1.5 text-xs text-zinc-500"><T id="newPage.pageTitleHelp" /></p>
            </div>
            <SlugField slug={slug} label={<T id="newPage.webAddress" />} onChange={setCustomSlug} />
          </section>

          <section aria-labelledby="step-template" className="space-y-4">
            <StepHeading id="step-template" number={2}><T id="newPage.stepTemplate" /></StepHeading>
            <div role="radiogroup" aria-labelledby="step-template" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PAGE_TEMPLATES.map((template) => {
                const active = template.id === templateId;
                return (
                  <button key={template.id} type="button" role="radio" aria-checked={active} onClick={() => setTemplateId(template.id)}
                    className={cn('relative rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                      active ? 'border-brand-green bg-brand-green/5 ring-1 ring-brand-green' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50')}>
                    <span className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-extrabold text-zinc-900">
                        <Layers className={cn('h-4 w-4', active ? 'text-brand-green' : 'text-zinc-400')} aria-hidden /> <T id={template.label} />
                      </span>
                      {active && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-white"><Check className="h-3 w-3" aria-hidden /></span>}
                    </span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-zinc-500"><T id={template.description} /></span>
                    <span className="mt-2 block text-2xs font-semibold text-zinc-400">
                      {template.sections.length === 0 ? <T id="newPage.noSections" /> : template.sections.map((type, i) => (
                        <React.Fragment key={type}>{i > 0 && ' · '}<TServer text={byType.get(type)?.label ?? type} /></React.Fragment>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {problem && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{problem}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-zinc-100 bg-zinc-50/60 px-8 py-4">
          <Link href="/admin/pages" className="rounded-lg px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100"><T id="newPage.cancel" /></Link>
          <button type="submit" disabled={!canCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-6 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-50">
            {creating && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} <T id="newPage.submit" />
          </button>
        </div>
      </form>
    </div>
  );
}

function StepHeading({ id, number, children }: { id: string; number: number; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-wider text-zinc-900">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs text-white" aria-hidden>{number}</span>
      {children}
    </h2>
  );
}
