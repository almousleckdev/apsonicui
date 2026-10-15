'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionIcon } from '../renderer/registry';
import type { SectionDefinition } from '@/lib/page-builder/types';

interface Props {
  definitions: SectionDefinition[];
  /** Where the new section will go, described for the heading ("after Hero banner", "at the end"). */
  positionLabel: string;
  onPick: (type: string) => void;
  onClose: () => void;
}

const CATEGORY_ORDER = ['Banners', 'Content', 'Media', 'Showcase', 'Social proof', 'Conversion', 'Layout'];

/** The section library: click a card to insert it, or drag it onto the outline on the left. */
export function AddSectionPanel({ definitions, positionLabel, onPick, onClose }: Props) {
  const [query, setQuery] = useState('');
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    search.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = definitions.filter((d) => !q || d.label.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
    const map = new Map<string, SectionDefinition[]>();
    for (const d of matches) map.set(d.category, [...(map.get(d.category) ?? []), d]);
    return [...map.entries()].sort(([a], [b]) => (CATEGORY_ORDER.indexOf(a) + 100) % 100 - (CATEGORY_ORDER.indexOf(b) + 100) % 100);
  }, [definitions, query]);

  return (
    <div role="dialog" aria-label="Add a section" className="absolute inset-y-0 left-0 z-30 flex w-[420px] max-w-full flex-col border-r border-zinc-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-extrabold text-zinc-900">Add a section</h2>
          <p className="text-[11px] text-zinc-500">It will be added {positionLabel}. Or drag a card into the outline.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"><X className="h-4 w-4" /></button>
      </div>
      <div className="border-b border-zinc-200 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
          <input ref={search} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sections…" aria-label="Search sections"
            className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20" />
        </div>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {groups.length === 0 && <p className="py-10 text-center text-sm text-zinc-500">No section matches “{query}”.</p>}
        {groups.map(([category, items]) => (
          <section key={category}>
            <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-zinc-400">{category}</h3>
            <ul className="grid grid-cols-2 gap-2">
              {items.map((d) => <LibraryCard key={d.type} definition={d} onPick={onPick} />)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function LibraryCard({ definition, onPick }: { definition: SectionDefinition; onPick: (type: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `lib:${definition.type}`, data: { kind: 'library', type: definition.type } });
  return (
    <li>
      <button ref={setNodeRef} type="button" {...attributes} {...listeners} onClick={() => onPick(definition.type)}
        className={cn('flex h-full w-full cursor-grab touch-none flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-left transition-all hover:border-brand-green hover:shadow-md active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-brand-green', isDragging && 'opacity-40')}>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green"><SectionIcon type={definition.type} className="h-4 w-4" /></span>
        <span className="text-xs font-extrabold text-zinc-900">{definition.label}</span>
        <span className="line-clamp-2 text-[11px] leading-snug text-zinc-500">{definition.description}</span>
      </button>
    </li>
  );
}
