'use client';

import React, { useId, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { T, TServer } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import { NewsRichTextEditor } from '@/components/admin/news/NewsRichTextEditor';
import { cn } from '@/lib/utils';
import { issuePath } from '@/lib/page-builder/document';
import { isFieldVisible, optionLabel } from '@/lib/page-builder/fields';
import { ColorField } from './ColorField';
import type { FieldDef, Locale } from '@/lib/page-builder/types';

export type Path = Array<string | number>;

/** What every field editor needs to read problems and report edits. */
export interface FieldContext {
  locale: Locale;
  sectionIndex: number;
  /** Server-reported problems by path, e.g. sections[2].content.heading.en */
  issues: Map<string, string>;
  onChange: (path: Path, value: unknown, groupKey: string) => void;
  onAddItem: (listPath: Path, field: FieldDef) => void;
  onRemoveItem: (listPath: Path, index: number) => void;
  onMoveItem: (listPath: Path, from: number, to: number) => void;
}

export const INPUT_CLASS =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20';

const looksLikeLink = (value: string) => /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(value);

interface Props {
  field: FieldDef;
  /** The value of this field (for translated fields the whole {en, fr, zh} object). */
  value: unknown;
  /** Where this field lives inside the section content. */
  path: Path;
  ctx: FieldContext;
}

/** Renders the editor for one field from its definition. Lists recurse into their item fields. */
export function FieldControl({ field, value, path, ctx }: Props) {
  const id = useId();
  const { t, tServer } = useAdminText();
  // Bumped when text is copied in, so the rich text editor (which only reads its content once) starts again from it.
  const [copies, setCopies] = useState(0);
  const localePath = field.localized ? [...path, ctx.locale] : path;
  const current = field.localized
    ? ((value as Record<string, string> | undefined)?.[ctx.locale] ?? '')
    : value;
  const english = field.localized && ctx.locale !== 'en' ? ((value as Record<string, string> | undefined)?.en ?? '') : '';
  const error = ctx.issues.get(issuePath(ctx.sectionIndex, localePath)) ?? ctx.issues.get(issuePath(ctx.sectionIndex, path));
  const groupKey = `${ctx.sectionIndex}:${localePath.join('.')}`;
  const set = (next: unknown) => ctx.onChange(localePath, next, groupKey);

  if (field.kind === 'LIST') {
    return <ListField field={field} items={Array.isArray(value) ? value : []} path={path} ctx={ctx} error={error} />;
  }

  const label = (
    <label htmlFor={id} className="mb-1 flex items-baseline justify-between gap-2 text-xs font-bold text-zinc-700">
      <span>
        <TServer text={field.label} />
        {field.required && <span className="ml-0.5 text-red-500" aria-label={t('editor.field.required')}>*</span>}
      </span>
      {typeof current === 'string' && field.maxLength && current.length > field.maxLength * 0.8 && (
        <span className={cn('font-medium', current.length > field.maxLength ? 'text-red-500' : 'text-zinc-400')}>{current.length}/{field.maxLength}</span>
      )}
    </label>
  );

  let control: React.ReactNode;
  switch (field.kind) {
    case 'TEXT':
      control = (
        <input id={id} type="text" value={(current as string) ?? ''} maxLength={field.maxLength ? field.maxLength + 20 : undefined}
          placeholder={english || undefined} onChange={(e) => set(e.target.value)} className={INPUT_CLASS} aria-invalid={!!error} />
      );
      break;
    case 'TEXTAREA':
      control = (
        <textarea id={id} rows={3} value={(current as string) ?? ''} placeholder={english || undefined}
          onChange={(e) => set(e.target.value)} className={cn(INPUT_CLASS, 'resize-y')} aria-invalid={!!error} />
      );
      break;
    case 'RICHTEXT':
      control = (
        <div className="min-h-[140px] rounded-lg border border-zinc-200 bg-white p-2 text-sm focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20">
          <NewsRichTextEditor key={`${ctx.sectionIndex}-${path.join('.')}-${ctx.locale}-${copies}`} contentHtml={(current as string) ?? ''}
            onChange={(html) => set(html)} placeholder={t(english ? 'editor.field.richFallback' : 'editor.field.richPlaceholder')} />
        </div>
      );
      break;
    case 'URL': {
      const text = (current as string) ?? '';
      control = (
        <>
          <input id={id} type="text" inputMode="url" value={text} placeholder={t('editor.field.linkPlaceholder')} onChange={(e) => set(e.target.value.trim())}
            className={INPUT_CLASS} aria-invalid={!!error} />
          {text && !looksLikeLink(text) && !error && (
            <p className="mt-1 text-2xs font-medium text-amber-600"><T id="editor.field.linkHint" /></p>
          )}
        </>
      );
      break;
    }
    case 'MEDIA':
      control = (
        <CompactMediaField allowAddress value={(current as string) ?? ''} onChange={(url) => set(url)}
          accept={/video/i.test(field.name) ? 'video/mp4,video/webm' : 'image/*'} />
      );
      break;
    case 'COLOR':
      return (
        <div>
          <ColorField label={<TServer text={field.label} />} labelText={tServer(field.label)} value={typeof current === 'string' ? current : undefined} onChange={(hex) => set(hex)} help={field.help ? <TServer text={field.help} /> : undefined} />
          {error && <p role="alert" className="mt-1 text-2xs font-semibold text-red-600">{error}</p>}
        </div>
      );
    case 'ENUM': {
      const options = field.options ?? [];
      const selected = (current as string) ?? field.defaultValue ?? '';
      control = options.length <= 4 ? (
        <div role="radiogroup" aria-label={tServer(field.label)} className="inline-flex w-full rounded-lg bg-zinc-100 p-0.5">
          {options.map((option) => (
            <button key={option} type="button" role="radio" aria-checked={selected === option} onClick={() => set(option)}
              className={cn('flex-1 rounded-md px-2 py-1.5 text-xs font-bold transition-colors', selected === option ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}>
              <TServer text={optionLabel(field, option, options.indexOf(option))} />
            </button>
          ))}
        </div>
      ) : (
        <div className="relative">
          <select id={id} value={selected as string} onChange={(e) => set(e.target.value)} className={cn(INPUT_CLASS, 'appearance-none pr-8')}>
            {options.map((option, i) => <option key={option} value={option}>{tServer(optionLabel(field, option, i))}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
        </div>
      );
      break;
    }
    case 'NUMBER': {
      const min = field.min ?? 0;
      const max = field.max ?? 100;
      const n = typeof current === 'number' ? current : Number(field.defaultValue ?? min);
      control = (
        <div className="flex items-center gap-3">
          <input id={id} type="range" min={min} max={max} value={n} onChange={(e) => set(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-brand-green" />
          <span className="w-9 text-right text-xs font-bold tabular-nums text-zinc-600">{n}</span>
        </div>
      );
      break;
    }
    case 'BOOLEAN': {
      const on = current === undefined ? field.defaultValue === true : current === true;
      return (
        <div className="flex items-center justify-between gap-3 py-1">
          <span id={id} className="text-xs font-bold text-zinc-700"><TServer text={field.label} /></span>
          <button type="button" role="switch" aria-checked={on} aria-labelledby={id} onClick={() => set(!on)}
            className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', on ? 'bg-brand-green' : 'bg-zinc-300')}>
            <span className={cn('absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', on && 'translate-x-4')} />
          </button>
        </div>
      );
    }
    default:
      control = null;
  }

  return (
    <div>
      {field.kind === 'MEDIA' || field.kind === 'ENUM' ? <p className="mb-1 text-xs font-bold text-zinc-700"><TServer text={field.label} />{field.required && <span className="ml-0.5 text-red-500">*</span>}</p> : label}
      {control}
      {field.localized && (field.kind === 'TEXT' || field.kind === 'TEXTAREA' || field.kind === 'RICHTEXT') && (
        <CopyFromLanguage current={ctx.locale} values={(value as Record<string, string> | undefined) ?? {}}
          onCopy={(text) => { set(text); setCopies((n) => n + 1); }} />
      )}
      {field.help && !error && <p className="mt-1 text-2xs text-zinc-400"><TServer text={field.help} /></p>}
      {error && <p role="alert" className="mt-1 text-2xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function ListField({ field, items, path, ctx, error }: { field: FieldDef; items: unknown[]; path: Path; ctx: FieldContext; error?: string }) {
  const { t } = useAdminText();
  const max = field.maxItems ?? 50;
  const itemFields = field.itemFields ?? [];
  const firstText = itemFields.find((f) => f.kind === 'TEXT');

  const summary = (item: Record<string, unknown>, index: number) => {
    const raw = firstText ? item[firstText.name] : undefined;
    const text = typeof raw === 'string' ? raw : ((raw as Record<string, string> | undefined)?.en ?? '');
    return text ? text : t('editor.field.itemFallback', { number: index + 1 });
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-bold text-zinc-700"><TServer text={field.label} /> <span className="font-medium text-zinc-400">({items.length}/{max})</span></p>
        <button type="button" disabled={items.length >= max} onClick={() => ctx.onAddItem(path, field)}
          className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-2xs font-bold text-zinc-700 hover:bg-zinc-200 disabled:opacity-40">
          <Plus className="h-3.5 w-3.5" aria-hidden /> <T id="editor.field.listAdd" />
        </button>
      </div>
      {items.length === 0 && <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-4 text-center text-xs text-zinc-400"><T id="editor.field.listNone" /></p>}
      <ul className="space-y-2">
        {items.map((raw, index) => {
          const item = (raw ?? {}) as Record<string, unknown>;
          const itemPath: Path = [...path, index];
          return (
            <li key={index}>
              <details className="group rounded-lg border border-zinc-200 bg-zinc-50/60" open={items.length <= 2}>
                <summary className="flex cursor-pointer list-none items-center gap-2 px-2.5 py-2 [&::-webkit-details-marker]:hidden">
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-zinc-700">{summary(item, index)}</span>
                  <span className="flex shrink-0 items-center" onClick={(e) => e.preventDefault()}>
                    <MiniButton label={t('editor.field.moveUp')} disabled={index === 0} onClick={() => ctx.onMoveItem(path, index, index - 1)}><ArrowUp className="h-3.5 w-3.5" /></MiniButton>
                    <MiniButton label={t('editor.field.moveDown')} disabled={index === items.length - 1} onClick={() => ctx.onMoveItem(path, index, index + 1)}><ArrowDown className="h-3.5 w-3.5" /></MiniButton>
                    <MiniButton label={t('editor.field.remove')} danger onClick={() => ctx.onRemoveItem(path, index)}><Trash2 className="h-3.5 w-3.5" /></MiniButton>
                  </span>
                </summary>
                <div className="space-y-3 border-t border-zinc-200 p-3">
                  {itemFields.filter((f) => isFieldVisible(f, item, itemFields)).map((f) => (
                    <FieldControl key={f.name} field={f} value={item[f.name]} path={[...itemPath, f.name]} ctx={ctx} />
                  ))}
                </div>
              </details>
            </li>
          );
        })}
      </ul>
      {error && <p role="alert" className="mt-1 text-2xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function MiniButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
      className={cn('rounded p-1 text-zinc-400 transition-colors disabled:opacity-30', danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-zinc-200 hover:text-zinc-800')}>
      {children}
    </button>
  );
}
