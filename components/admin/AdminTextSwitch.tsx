'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useAdminText } from '@/context/AdminTextContext';
import { ADMIN_TEXT_MODES } from '@/lib/i18n/admin/text';

const HINTS = { both: 'display.bothHint', en: 'display.enHint', zh: 'display.zhHint' } as const;

/** Chooses whether the admin shows Chinese and English together, or only one of them. */
export function AdminTextSwitch({ className }: { className?: string }) {
  const { mode, setMode, t } = useAdminText();
  return (
    <div role="radiogroup" aria-label={t('display.label')} className={cn('inline-flex rounded-lg bg-zinc-100 p-0.5', className)}>
      {ADMIN_TEXT_MODES.map((m) => (
        <button key={m} type="button" role="radio" aria-checked={mode === m} title={t(HINTS[m])} onClick={() => setMode(m)}
          className={cn('rounded-md px-2 py-1 text-2xs font-bold transition-colors', mode === m ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}>
          {m === 'both' ? '中/EN' : m === 'en' ? 'EN' : '中文'}
        </button>
      ))}
    </div>
  );
}
