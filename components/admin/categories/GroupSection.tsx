'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Edit2, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { isSafeImagePath } from '@/lib/media/safe-path';
import type { ProductMenuGroup } from '@/lib/product-menu/groups';
import type { CategoryItem } from '@/services/category';
import { CategoryRow } from './CategoryRow';

interface Props {
  group: ProductMenuGroup;
  /** Categories to list (already filtered by the page's search and brand). */
  categories: CategoryItem[];
  /** How many categories the group holds in total, filter or not: a group that holds any cannot be removed. */
  totalCount: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDeleteCategories: boolean;
  onMove: (direction: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddCategory: () => void;
  onToggleActive: (category: CategoryItem) => void;
  onEditCategory: (category: CategoryItem) => void;
  onDeleteCategory: (category: CategoryItem) => void;
}

const iconButton = 'p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed';

/** One group of the Products menu with its categories, laid out like the menu visitors see. */
export function GroupSection({ group, categories, totalCount, canMoveUp, canMoveDown, canDeleteCategories, onMove, onEdit, onDelete, onAddCategory, onToggleActive, onEditCategory, onDeleteCategory }: Props) {
  const names = [group.labelEn, group.labelFr, group.labelZh].filter(Boolean).slice(1);
  return (
    <section aria-label={group.labelEn || group.id} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-3 border-b border-zinc-100 bg-zinc-50/70 px-3 py-2.5">
        <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white flex items-center justify-center">
          {group.image && isSafeImagePath(group.image) ? (
            <Image src={group.image} alt="" fill sizes="64px" unoptimized className="object-contain p-0.5" />
          ) : (
            <ImageIcon className="h-4 w-4 text-zinc-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-black text-zinc-900">{group.labelEn || group.id}</h2>
          <p className="truncate text-2xs text-zinc-400">
            {names.length > 0 && <>{names.join(' · ')} · </>}
            {totalCount} categor{totalCount === 1 ? 'y' : 'ies'}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          <button type="button" aria-label="Move group up" disabled={!canMoveUp} onClick={() => onMove(-1)} className={iconButton}><ArrowUp className="h-3.5 w-3.5" /></button>
          <button type="button" aria-label="Move group down" disabled={!canMoveDown} onClick={() => onMove(1)} className={iconButton}><ArrowDown className="h-3.5 w-3.5" /></button>
          <button type="button" aria-label="Edit group" onClick={onEdit} className={iconButton}><Edit2 className="h-3.5 w-3.5" /></button>
          <button
            type="button"
            aria-label="Remove group"
            disabled={totalCount > 0}
            title={totalCount > 0 ? 'Move or delete its categories first' : 'Remove group'}
            onClick={onDelete}
            className={`${iconButton} text-red-500 hover:bg-red-50`}
          ><Trash2 className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onAddCategory} className="ml-2 inline-flex items-center gap-1 rounded-lg bg-brand-green px-2.5 py-1.5 text-2xs font-bold text-white hover:bg-green-700 cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Category
          </button>
        </div>
      </header>

      {categories.length === 0 ? (
        <p className="px-4 py-5 text-center text-xs text-zinc-400">
          {totalCount === 0 ? 'No categories in this group yet. Visitors do not see an empty group in the menu.' : 'No category matches the filter.'}
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {categories.map((c) => (
            <CategoryRow key={c.id} category={c} canDelete={canDeleteCategories} onToggleActive={onToggleActive} onEdit={onEditCategory} onDelete={onDeleteCategory} />
          ))}
        </ul>
      )}
    </section>
  );
}
