'use client';

import React from 'react';
import { useAdminText } from '@/context/AdminTextContext';

export type AdminLang = 'en' | 'fr' | 'zh';

export const ADMIN_LANGUAGES: Array<{ code: AdminLang; label: string; suffix: 'En' | 'Fr' | 'Zh' }> = [
  { code: 'en', label: 'English', suffix: 'En' },
  { code: 'fr', label: 'Français', suffix: 'Fr' },
  { code: 'zh', label: '中文', suffix: 'Zh' },
];

export const suffixOf = (lang: AdminLang) => ADMIN_LANGUAGES.find((l) => l.code === lang)!.suffix;

interface Props {
  value: AdminLang;
  onChange: (lang: AdminLang) => void;
  /** Languages that already have content; they get a green dot. */
  marked?: Partial<Record<AdminLang, boolean>>;
}

/** Compact English / French / Chinese switch used by the admin editors so each form shows one language at a time. */
export function LanguageTabs({ value, onChange, marked }: Props) {
  const { t } = useAdminText();
  return (
    <div role="tablist" aria-label={t('common.language')} className="inline-flex rounded-xl bg-zinc-100 p-0.5">
      {ADMIN_LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          role="tab"
          aria-selected={value === l.code}
          onClick={() => onChange(l.code)}
          className={`px-3 py-1 text-2xs font-bold whitespace-nowrap rounded-lg transition-colors cursor-pointer ${value === l.code ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
        >
          {marked?.[l.code] && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-green align-middle" aria-hidden />}
          {l.label}
          {marked?.[l.code] && <span className="sr-only"> ({t('news.form.done')})</span>}
        </button>
      ))}
    </div>
  );
}
