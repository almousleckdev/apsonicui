'use client';

import React from 'react';
import { Languages } from 'lucide-react';
import { useAdminText } from '@/context/AdminTextContext';
import { T } from '@/components/admin/T';
import { copySources, LANGUAGE_NAMES, type ContentLang } from '@/lib/i18n/translation-copy';

interface Props {
  /** The language being edited. */
  current: ContentLang;
  /** The text of the same field in each language. */
  values: Partial<Record<ContentLang, string | undefined>>;
  onCopy: (text: string, from: ContentLang) => void;
}

/**
 * Under a translated field: one button per other language that already has text, copying it here so the editor can
 * translate it instead of retyping. Shows nothing when there is nothing to copy.
 */
export function CopyFromLanguage({ current, values, onCopy }: Props) {
  const { t } = useAdminText();
  const sources = copySources(current, values);
  if (sources.length === 0) return null;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5">
      {sources.map(({ lang, text }) => {
        const language = LANGUAGE_NAMES[lang];
        return (
          <button key={lang} type="button" onClick={() => onCopy(text, lang)} title={t('translate.copyHint', { language })}
            className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-2xs font-bold text-zinc-600 transition-colors hover:bg-brand-green/10 hover:text-brand-green focus-visible:outline-2 focus-visible:outline-brand-green">
            <Languages className="h-3 w-3" aria-hidden /> <T id="translate.copyFrom" values={{ language }} />
          </button>
        );
      })}
    </div>
  );
}
