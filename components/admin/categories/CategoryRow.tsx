'use client';

import React from 'react';
import Image from 'next/image';
import { Edit2, ImageIcon, Trash2 } from 'lucide-react';
import { isSafeImagePath } from '@/lib/media/safe-path';
import type { CategoryItem } from '@/services/category';

interface Props {
  category: CategoryItem;
  canDelete: boolean;
  onToggleActive: (category: CategoryItem) => void;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}

/** One category as a compact line: picture, names in the three languages, brand, status and actions. */
export function CategoryRow({ category: c, canDelete, onToggleActive, onEdit, onDelete }: Props) {
  const active = c.active ?? true;
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] md:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1.5fr)_auto_auto_auto] items-center gap-x-3 gap-y-1 px-3 py-2">
      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 flex items-center justify-center">
        {c.imageUrl && isSafeImagePath(c.imageUrl) ? (
          <Image src={c.imageUrl} alt="" fill sizes="56px" unoptimized className="object-contain p-0.5" />
        ) : (
          <ImageIcon className="h-4 w-4 text-zinc-300" />
        )}
      </div>

      <div className="min-w-0">
        <p className={`truncate text-sm font-bold ${active ? 'text-zinc-900' : 'text-zinc-400'}`}>{c.nameEn || c.name}</p>
        <p className="truncate font-mono text-3xs text-zinc-400">{c.slug}</p>
      </div>

      <p className="hidden md:block min-w-0 truncate text-2xs text-zinc-500">
        <span className="text-zinc-400">FR</span> {c.nameFr || '—'} <span className="ml-2 text-zinc-400">中</span> {c.nameZh || '—'}
      </p>

      <span className={`hidden md:inline rounded-full px-2 py-0.5 text-3xs font-bold uppercase tracking-wider ${c.brand === 'apsonic-pro' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
        {c.brand}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={`${active ? 'Disable' : 'Enable'} ${c.nameEn || c.slug}`}
        onClick={() => onToggleActive(c)}
        className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${active ? 'bg-brand-green' : 'bg-zinc-300'}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${active ? 'left-[18px]' : 'left-0.5'}`} />
      </button>

      <div className="flex items-center justify-end gap-0.5">
        <button type="button" onClick={() => onEdit(c)} aria-label={`Edit ${c.nameEn || c.slug}`} className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 cursor-pointer">
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        {canDelete && (
          <button type="button" onClick={() => onDelete(c)} aria-label={`Delete ${c.nameEn || c.slug}`} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </li>
  );
}
