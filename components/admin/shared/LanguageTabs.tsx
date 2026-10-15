'use client';

import React from 'react';

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
}

/** Compact English / French / Chinese switch used by the admin editors so each form shows one language at a time. */
export function LanguageTabs({ value, onChange }: Props) {
  return (
    <div role="tablist" aria-label="Language" className="inline-flex rounded-xl bg-zinc-100 p-0.5">
      {ADMIN_LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          role="tab"
          aria-selected={value === l.code}
          onClick={() => onChange(l.code)}
          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${value === l.code ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
