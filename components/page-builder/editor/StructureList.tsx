'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sectionSummary } from '@/lib/page-builder/document';
import { SectionIcon } from '../renderer/registry';
import type { PageSection, SectionDefinition } from '@/lib/page-builder/types';

export const STRUCTURE_END_ID = 'structure-end';

interface Props {
  sections: PageSection[];
  definitions: Map<string, SectionDefinition>;
  selectedId: string | null;
  /** While a library card is dragged, the id of the row it would be inserted before. */
  dropTargetId: string | null;
  dragging: boolean;
  onSelect: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

/** The page outline: every section in order. Drag a row (or use the keyboard) to reorder. */
export function StructureList({ sections, definitions, selectedId, dropTargetId, dragging, onSelect, onToggleHidden, onDuplicate, onDelete, onAdd }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: STRUCTURE_END_ID });
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-extrabold text-zinc-900">Page sections</h2>
          <p className="text-[11px] text-zinc-500">{sections.length} {sections.length === 1 ? 'section' : 'sections'} · drag to reorder</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-1.5" aria-label="Page sections">
            {sections.map((section) => (
              <Row key={section.id} section={section} label={definitions.get(section.type)?.label ?? section.type}
                selected={section.id === selectedId} dropBefore={dragging && dropTargetId === section.id}
                onSelect={onSelect} onToggleHidden={onToggleHidden} onDuplicate={onDuplicate} onDelete={onDelete} />
            ))}
          </ul>
        </SortableContext>
        <div ref={setNodeRef} className={cn('mt-1.5 rounded-lg transition-colors', dragging && 'min-h-10', isOver && 'bg-brand-green/10 outline-dashed outline-2 outline-brand-green')}>
          {sections.length === 0 && !dragging && (
            <p className="rounded-lg border border-dashed border-zinc-300 px-3 py-6 text-center text-xs text-zinc-500">No sections yet. Add one to start.</p>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-200 p-3">
        <button type="button" onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-green-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
          <Plus className="h-4 w-4" aria-hidden /> Add section
        </button>
      </div>
    </div>
  );
}

function Row({ section, label, selected, dropBefore, onSelect, onToggleHidden, onDuplicate, onDelete }: {
  section: PageSection; label: string; selected: boolean; dropBefore: boolean;
  onSelect: (id: string) => void; onToggleHidden: (id: string) => void; onDuplicate: (id: string) => void; onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const summary = sectionSummary(section);
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('group relative rounded-lg border bg-white', selected ? 'border-brand-green ring-1 ring-brand-green' : 'border-zinc-200 hover:border-zinc-300', isDragging && 'z-10 opacity-60 shadow-lg')}>
      {dropBefore && <span className="absolute -top-1 inset-x-0 h-0.5 rounded bg-brand-green" aria-hidden />}
      <div className="flex items-center">
        <button type="button" aria-label={`Reorder ${label}`} {...attributes} {...listeners}
          className="cursor-grab touch-none rounded-l-lg px-1.5 py-3 text-zinc-300 hover:text-zinc-600 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-brand-green">
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" onClick={() => onSelect(section.id)} aria-current={selected ? 'true' : undefined}
          className="flex min-w-0 flex-1 items-center gap-2.5 py-2 pr-1 text-left">
          <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', selected ? 'bg-brand-green text-white' : 'bg-zinc-100 text-zinc-500')}><SectionIcon type={section.type} className="h-4 w-4" /></span>
          <span className="min-w-0">
            <span className={cn('block truncate text-xs font-bold', section.hidden ? 'text-zinc-400 line-through' : 'text-zinc-800')}>{label}</span>
            {summary && <span className="block truncate text-[11px] text-zinc-400">{summary}</span>}
          </span>
        </button>
        <span className="flex shrink-0 items-center pr-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <RowButton label={section.hidden ? 'Show section' : 'Hide section'} onClick={() => onToggleHidden(section.id)}>{section.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</RowButton>
          <RowButton label="Duplicate section" onClick={() => onDuplicate(section.id)}><Copy className="h-3.5 w-3.5" /></RowButton>
          <RowButton label="Delete section" danger onClick={() => onDelete(section.id)}><Trash2 className="h-3.5 w-3.5" /></RowButton>
        </span>
      </div>
    </li>
  );
}

function RowButton({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className={cn('rounded p-1 text-zinc-400 transition-colors', danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-zinc-100 hover:text-zinc-800')}>
      {children}
    </button>
  );
}
