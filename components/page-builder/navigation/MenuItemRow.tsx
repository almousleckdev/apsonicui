'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDown, ArrowUp, EyeOff, FileText, GripVertical, Heading, Home, Link2, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ItemKind, MenuItem } from '@/lib/navigation/types';
import type { AdminKey } from '@/lib/i18n/admin/catalog';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

const ICONS: Record<ItemKind, typeof FileText> = { PAGE: FileText, ROUTE: Home, EXTERNAL: Link2, GROUP: Heading };

interface Props {
  item: MenuItem;
  depth: number;
  label: string;
  subtitle: string;
  selected: boolean;
  warnings: AdminKey[];
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onUp: () => void;
  onDown: () => void;
}

export function MenuItemRow({ item, depth, label, subtitle, selected, warnings, canMoveUp, canMoveDown, onSelect, onUp, onDown }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const Icon = ICONS[item.kind];
  const { t } = useAdminText();
  const warningText = warnings.map((w) => t(w)).join('. ');
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, marginLeft: depth * 28 }}
      className={cn('group relative rounded-lg border bg-white', selected ? 'border-brand-green ring-1 ring-brand-green' : 'border-zinc-200 hover:border-zinc-300',
        isDragging && 'z-10 opacity-60 shadow-lg', depth > 0 && 'before:absolute before:-left-3.5 before:top-1/2 before:h-px before:w-3 before:bg-zinc-300')}>
      <div className="flex items-center">
        <button type="button" aria-label={t('navigation.row.reorder', { name: label })} {...attributes} {...listeners}
          className="cursor-grab touch-none rounded-l-lg px-1.5 py-3 text-zinc-300 hover:text-zinc-600 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-brand-green">
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" onClick={onSelect} aria-current={selected ? 'true' : undefined} className="flex min-w-0 flex-1 items-center gap-2.5 py-2 pr-2 text-left">
          <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', selected ? 'bg-brand-green text-white' : 'bg-zinc-100 text-zinc-500')}><Icon className="h-4 w-4" aria-hidden /></span>
          <span className="min-w-0">
            <span className={cn('block truncate text-sm font-bold', item.visible ? 'text-zinc-800' : 'text-zinc-400 line-through')}>{label}</span>
            <span className="block truncate text-2xs text-zinc-400">{subtitle}</span>
          </span>
          {!item.visible && <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-3xs font-bold text-zinc-500"><EyeOff className="h-3 w-3" aria-hidden /><T id="navigation.row.hidden" /></span>}
          {warnings.length > 0 && <span className="shrink-0 text-amber-600" title={warningText}><TriangleAlert className="h-4 w-4" aria-label={warningText} /></span>}
        </button>
        <span className="flex shrink-0 items-center pr-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <Mini label={t('navigation.row.up')} disabled={!canMoveUp} onClick={onUp}><ArrowUp className="h-3.5 w-3.5" /></Mini>
          <Mini label={t('navigation.row.down')} disabled={!canMoveDown} onClick={onDown}><ArrowDown className="h-3.5 w-3.5" /></Mini>
        </span>
      </div>
    </li>
  );
}

function Mini({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-25 disabled:hover:bg-transparent">
      {children}
    </button>
  );
}
