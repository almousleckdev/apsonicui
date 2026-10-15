'use client';

import React, { useId, useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PALETTE, safeColor } from '@/lib/page-builder/colors';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface Props {
  label: React.ReactNode;
  /** The same label as plain text, for the palette's accessible name. */
  labelText: string;
  value: string | undefined;
  onChange: (hex: string) => void;
  /** One line under the swatches explaining what an empty value means. */
  help?: React.ReactNode;
}

/** A color: the Apsonic palette, the browser's free picker, or a typed #rrggbb. Empty means "automatic". */
export function ColorField({ label, labelText, value, onChange, help }: Props) {
  const id = useId();
  const { t } = useAdminText();
  const current = safeColor(value);
  const [typed, setTyped] = useState<string | null>(null);
  const shown = typed ?? current ?? '';
  const invalid = typed !== null && typed !== '' && !safeColor(typed);

  const commitTyped = (raw: string) => {
    const withHash = raw.startsWith('#') ? raw : `#${raw}`;
    setTyped(raw);
    if (safeColor(withHash)) { onChange(withHash.toLowerCase()); setTyped(null); }
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor={`${id}-hex`} className="text-xs font-bold text-zinc-700">{label}</label>
        {current
          ? <button type="button" onClick={() => { onChange(''); setTyped(null); }} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-2xs font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"><X className="h-3 w-3" aria-hidden /><T id="editor.color.clear" /></button>
          : <span className="text-2xs font-medium text-zinc-400"><T id="editor.color.automatic" /></span>}
      </div>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t('editor.color.palette', { label: labelText })}>
        {PALETTE.map(({ name, hex }) => {
          const selected = current === hex;
          return (
            <button key={hex} type="button" title={name} aria-label={name} aria-pressed={selected} onClick={() => { onChange(hex); setTyped(null); }}
              className={cn('relative h-6 w-6 rounded-full border border-black/15 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green', selected && 'ring-2 ring-brand-green ring-offset-1')}
              style={{ background: hex }}>
              {selected && <Check className="absolute inset-0 m-auto h-3.5 w-3.5" style={{ color: hex === '#ffffff' || hex === '#f4f4f5' || hex === '#ffd700' ? '#18181b' : '#ffffff' }} aria-hidden />}
            </button>
          );
        })}
        <label className="relative inline-flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-zinc-400 text-3xs font-bold text-zinc-500 hover:border-zinc-700" title={t('editor.color.chooseAny')}>
          <span aria-hidden>+</span>
          <span className="sr-only"><T id="editor.color.chooseAny" /></span>
          <input type="color" value={current ?? '#00a651'} onChange={(e) => { onChange(e.target.value.toLowerCase()); setTyped(null); }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        </label>
        <input id={`${id}-hex`} type="text" value={shown} placeholder="#00a651" maxLength={7} spellCheck={false} aria-invalid={invalid}
          onChange={(e) => commitTyped(e.target.value)} onBlur={() => setTyped(null)}
          className={cn('ml-1 w-[5.5rem] rounded-md border bg-white px-2 py-1 font-mono text-xs focus:outline-none focus:ring-2', invalid ? 'border-red-400 focus:ring-red-200' : 'border-zinc-200 focus:border-brand-green focus:ring-brand-green/20')} />
      </div>
      {help && !invalid && <p className="mt-1.5 text-2xs leading-snug text-zinc-400">{help}</p>}
      {invalid && <p role="alert" className="mt-1 text-2xs font-semibold text-red-600"><T id="editor.color.invalid" /></p>}
    </div>
  );
}
