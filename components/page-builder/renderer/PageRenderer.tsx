'use client';

import React from 'react';
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Locale, PageDocument } from '@/lib/page-builder/types';
import { SECTION_REGISTRY } from './registry';
import type { RenderContext } from './shared';

export type SectionAction = 'up' | 'down' | 'duplicate' | 'delete' | 'toggle-hidden';

interface PageRendererProps {
  document: PageDocument;
  locale: Locale;
  /** Builder mode: sections can be selected, hidden ones stay visible (dimmed), empty ones show hints. */
  editing?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onInsert?: (index: number) => void;
  onAction?: (id: string, action: SectionAction) => void;
  labelFor?: (type: string) => string;
}

/**
 * Draws a page document. The public site, the secure preview and the builder canvas all use this one component, so
 * what an editor sees is what a visitor gets.
 */
export function PageRenderer({ document, locale, editing = false, selectedId, onSelect, onInsert, onAction, labelFor }: PageRendererProps) {
  const ctx: RenderContext = { locale, editing };
  const sections = document.sections;
  // The site header is fixed (5rem). A hero draws underneath it; anything else needs room so its top is not covered.
  const firstVisible = sections.find((s) => !s.hidden || editing);
  const headerOffset = firstVisible && firstVisible.type !== 'hero' ? 'pt-20' : '';

  if (!editing) {
    return (
      <div className={cn('w-full', headerOffset)}>
        {sections.filter((s) => !s.hidden).map((section) => {
          const entry = SECTION_REGISTRY[section.type];
          return entry ? <entry.Component key={section.id} section={section} ctx={ctx} /> : null;
        })}
      </div>
    );
  }

  return (
    <div className={cn('w-full', headerOffset)} onClick={() => onSelect?.(null)}>
      {sections.length === 0 && (
        <div className="mx-auto my-24 max-w-md rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-8 py-14 text-center">
          <p className="text-lg font-extrabold text-zinc-800">This page is empty</p>
          <p className="mt-1 text-sm text-zinc-500">Add a section to start building.</p>
          <button type="button" onClick={(e) => { e.stopPropagation(); onInsert?.(0); }} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-bold text-white hover:bg-brand-green-hover">
            <Plus className="h-4 w-4" aria-hidden /> Add section
          </button>
        </div>
      )}
      {sections.map((section, index) => {
        const entry = SECTION_REGISTRY[section.type];
        const selected = section.id === selectedId;
        return (
          <React.Fragment key={section.id}>
            <InsertSlot index={index} onInsert={onInsert} />
            <div
              data-section-id={section.id}
              onClickCapture={(e) => { if ((e.target as HTMLElement).closest('a')) e.preventDefault(); }}
              onClick={(e) => { e.stopPropagation(); onSelect?.(section.id); }}
              className={cn(
                'group/section relative cursor-pointer outline-offset-[-2px] transition-[outline-color]',
                selected ? 'outline outline-2 outline-brand-green' : 'hover:outline hover:outline-2 hover:outline-brand-green/50',
              )}
            >
              <div className={cn(section.hidden && 'opacity-40 grayscale')}>
                {entry ? <entry.Component section={section} ctx={ctx} /> : <div className="p-10 text-center text-sm text-zinc-500">Unsupported section: {section.type}</div>}
              </div>
              <div className={cn('pointer-events-none absolute left-0 top-0 z-20 flex items-center gap-1 rounded-br-lg bg-brand-green px-2.5 py-1 text-[11px] font-bold text-white', selected ? 'opacity-100' : 'opacity-0 group-hover/section:opacity-100')}>
                {labelFor?.(section.type) ?? section.type}
                {section.hidden && <span className="rounded bg-black/30 px-1.5">Hidden</span>}
              </div>
              {selected && (
                <div className="absolute right-3 top-3 z-20 flex items-center gap-0.5 rounded-lg bg-zinc-900 p-1 text-white shadow-lg" onClick={(e) => e.stopPropagation()}>
                  <ToolButton label="Move up" disabled={index === 0} onClick={() => onAction?.(section.id, 'up')}><ArrowUp className="h-4 w-4" /></ToolButton>
                  <ToolButton label="Move down" disabled={index === sections.length - 1} onClick={() => onAction?.(section.id, 'down')}><ArrowDown className="h-4 w-4" /></ToolButton>
                  <ToolButton label="Duplicate" onClick={() => onAction?.(section.id, 'duplicate')}><Copy className="h-4 w-4" /></ToolButton>
                  <ToolButton label={section.hidden ? 'Show section' : 'Hide section'} onClick={() => onAction?.(section.id, 'toggle-hidden')}>{section.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</ToolButton>
                  <ToolButton label="Delete" danger onClick={() => onAction?.(section.id, 'delete')}><Trash2 className="h-4 w-4" /></ToolButton>
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
      {sections.length > 0 && <InsertSlot index={sections.length} onInsert={onInsert} last />}
    </div>
  );
}

function ToolButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className={cn('rounded-md p-1.5 transition-colors disabled:opacity-30', danger ? 'hover:bg-red-600' : 'hover:bg-white/20')}>
      {children}
    </button>
  );
}

/** A thin strip between sections that reveals "Add section" on hover or keyboard focus. */
function InsertSlot({ index, onInsert, last }: { index: number; onInsert?: (index: number) => void; last?: boolean }) {
  return (
    <div className={cn('group/slot relative z-10 h-0', last && 'h-10')}>
      <div className="absolute inset-x-0 top-0 h-6 -translate-y-1/2 flex items-center justify-center">
        <button type="button" onClick={(e) => { e.stopPropagation(); onInsert?.(index); }}
          className="inline-flex items-center gap-1 rounded-full bg-brand-green px-3 py-1 text-[11px] font-bold text-white opacity-0 shadow-md transition-opacity focus-visible:opacity-100 group-hover/slot:opacity-100">
          <Plus className="h-3.5 w-3.5" aria-hidden /> Add section
        </button>
      </div>
    </div>
  );
}
