'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addListItem, applicableStyleFields, moveListItem, removeListItem, setContent, setHidden, setStyle } from '@/lib/page-builder/document';
import { groupFields, isFieldVisible } from '@/lib/page-builder/fields';
import { SectionIcon } from '../renderer/registry';
import type { FieldDef, Locale, PageDocument, PageSection, SectionDefinition } from '@/lib/page-builder/types';
import { FieldControl, type FieldContext, type Path } from './fields/FieldControl';

interface Props {
  section: PageSection;
  sectionIndex: number;
  definition: SectionDefinition | undefined;
  styleFields: FieldDef[];
  locale: Locale;
  /** Server-reported problems by path. */
  issues: Map<string, string>;
  edit: (change: (doc: PageDocument) => PageDocument, groupKey?: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

type Tab = 'content' | 'style';

/** Edits the selected section. Every control is generated from the section's field definition. */
export function PropertiesPanel({ section, sectionIndex, definition, styleFields, locale, issues, edit, onDuplicate, onDelete }: Props) {
  const [tab, setTab] = useState<Tab>('content');
  const id = section.id;
  const applicable = useMemo(() => applicableStyleFields(definition, styleFields), [definition, styleFields]);

  const contentCtx: FieldContext = useMemo(() => ({
    locale,
    sectionIndex,
    issues,
    onChange: (path: Path, value: unknown, groupKey: string) => edit((d) => setContent(d, id, path, value), groupKey),
    onAddItem: (listPath, field) => edit((d) => addListItem(d, id, listPath, field)),
    onRemoveItem: (listPath, index) => edit((d) => removeListItem(d, id, listPath, index)),
    onMoveItem: (listPath, from, to) => edit((d) => moveListItem(d, id, listPath, from, to)),
  }), [locale, sectionIndex, issues, edit, id]);

  const styleCtx: FieldContext = useMemo(() => ({
    ...contentCtx,
    onChange: (path, value) => edit((d) => setStyle(d, id, path[0] as 'background' | 'paddingTop' | 'paddingBottom' | 'width', String(value)), `style:${id}`),
  }), [contentCtx, edit, id]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-3 border-b border-zinc-200 px-4 py-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green"><SectionIcon type={section.type} className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-extrabold text-zinc-900">{definition?.label ?? section.type}</h2>
          <p className="line-clamp-2 text-[11px] text-zinc-500">{definition?.description}</p>
        </div>
        <div className="flex shrink-0 items-center">
          <IconButton label={section.hidden ? 'Show on the page' : 'Hide from the page'} onClick={() => edit((d) => setHidden(d, id, !section.hidden))}>
            {section.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </IconButton>
          <IconButton label="Duplicate section" onClick={onDuplicate}><Copy className="h-4 w-4" /></IconButton>
          <IconButton label="Delete section" danger onClick={onDelete}><Trash2 className="h-4 w-4" /></IconButton>
        </div>
      </div>

      <div role="tablist" aria-label="Section settings" className="flex gap-1 border-b border-zinc-200 px-3 pt-2">
        {(['content', 'style'] as Tab[]).map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)}
            className={cn('-mb-px border-b-2 px-3 py-2 text-xs font-bold capitalize transition-colors', tab === t ? 'border-brand-green text-brand-green' : 'border-transparent text-zinc-500 hover:text-zinc-800')}>
            {t === 'style' ? 'Layout' : 'Content'}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="flex-1 space-y-4 overflow-y-auto p-4">
        {section.hidden && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800">This section is hidden. Visitors will not see it.</p>
        )}
        {tab === 'content' && (
          definition && definition.fields.length > 0
            ? <FieldGroups scope={`${id}:content`} fields={definition.fields} values={section.content} ctx={contentCtx} />
            : <p className="text-xs text-zinc-500">This section has nothing to configure.</p>
        )}
        {tab === 'style' && (
          applicable.length > 0
            ? <FieldGroups scope={`${id}:style`} fields={applicable} values={section.style as Record<string, unknown>} ctx={styleCtx} />
            : <p className="text-xs text-zinc-500">This section draws its own background, so it has no layout settings.</p>
        )}
      </div>
    </div>
  );
}

function IconButton({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className={cn('rounded-md p-1.5 text-zinc-400 transition-colors', danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-zinc-100 hover:text-zinc-800')}>
      {children}
    </button>
  );
}

/**
 * Fields collected under their group titles, each group collapsible. Fields that depend on another field (for
 * example "Height (px)" only for a custom height) appear only while their condition holds.
 */
function FieldGroups({ scope, fields, values, ctx }: { scope: string; fields: FieldDef[]; values: Record<string, unknown>; ctx: FieldContext }) {
  const visible = fields.filter((f) => isFieldVisible(f, values, fields));
  return (
    <div className="space-y-3">
      {groupFields(visible).map((group, index) => (
        <details key={group.title} open={index < 2} className="group/section rounded-xl border border-zinc-200 bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-zinc-500 [&::-webkit-details-marker]:hidden">
            {group.title}
            <ChevronDown className="h-4 w-4 text-zinc-400 transition-transform group-open/section:rotate-180" aria-hidden />
          </summary>
          <div className="space-y-4 border-t border-zinc-100 p-3">
            {group.fields.map((field) => (
              <FieldControl key={`${scope}:${field.name}`} field={field} value={values[field.name]} path={[field.name]} ctx={ctx} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
