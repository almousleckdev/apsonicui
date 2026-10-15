'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { productMenuService } from '@/services/product-menu-service';
import {
  PRODUCT_MENU_LIMITS,
  countByGroup,
  moveGroup,
  uniqueGroupId,
  validateGroups,
  type ProductMenuGroup,
} from '@/lib/product-menu/groups';

interface Props {
  groups: ProductMenuGroup[];
  /** Categories, used to stop a group that still has categories from being removed. */
  categories: Array<{ parentType?: string }>;
  onSaved: (groups: ProductMenuGroup[]) => void;
}

const INPUT = 'w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none text-xs';

export function ProductMenuGroupsEditor({ groups, categories, onSaved }: Props) {
  const { toast } = useToast();
  // Re-seed the draft when the saved list changes (state-from-props pattern, no effect needed).
  const [draft, setDraft] = useState<ProductMenuGroup[]>(groups);
  const [seenGroups, setSeenGroups] = useState(groups);
  if (seenGroups !== groups) {
    setSeenGroups(groups);
    setDraft(groups);
  }
  const [saving, setSaving] = useState(false);

  const usage = useMemo(() => countByGroup(categories), [categories]);
  const errors = useMemo(() => validateGroups(draft), [draft]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(groups);

  // Edits are applied by id to the latest list, never by position, so a re-render cannot misdirect them.
  const patch = (id: string, change: Partial<ProductMenuGroup>) =>
    setDraft((list) => list.map((g) => (g.id === id ? { ...g, ...change } : g)));

  const add = () =>
    setDraft((list) =>
      list.length >= PRODUCT_MENU_LIMITS.maxGroups
        ? list
        : [...list, { id: uniqueGroupId('new-group', list), labelEn: '', labelFr: '', labelZh: '' }],
    );

  const save = async () => {
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }
    setSaving(true);
    try {
      const cleaned = draft.map((g) => ({
        ...g,
        labelEn: g.labelEn.trim(),
        labelFr: g.labelFr.trim(),
        labelZh: g.labelZh.trim(),
      }));
      await productMenuService.saveGroups(cleaned);
      onSaved(cleaned);
      toast.success('Products menu saved.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not save the Products menu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm space-y-4 font-sans">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-zinc-900">Products menu groups</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            The left-hand list of the Products dropdown (e.g. Two-wheeler). Choose a group for each category below.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={add}
            disabled={draft.length >= PRODUCT_MENU_LIMITS.maxGroups}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add group
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty || errors.length > 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-brand-green text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save menu'}
          </button>
        </div>
      </div>

      <ul className="space-y-3">
        {draft.map((g, index) => {
          const inUse = usage[g.id] ?? 0;
          return (
            <li key={g.id} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end border border-zinc-100 rounded-2xl p-3">
              <label className="text-[11px] font-bold text-zinc-600">
                English *
                <input className={INPUT} value={g.labelEn} maxLength={PRODUCT_MENU_LIMITS.label}
                  onChange={(e) => patch(g.id, { labelEn: e.target.value })} placeholder="Two-wheeler" />
              </label>
              <label className="text-[11px] font-bold text-zinc-600">
                Français
                <input className={INPUT} value={g.labelFr} maxLength={PRODUCT_MENU_LIMITS.label}
                  onChange={(e) => patch(g.id, { labelFr: e.target.value })} placeholder="Deux-roues" />
              </label>
              <label className="text-[11px] font-bold text-zinc-600">
                中文
                <input className={INPUT} value={g.labelZh} maxLength={PRODUCT_MENU_LIMITS.label}
                  onChange={(e) => patch(g.id, { labelZh: e.target.value })} placeholder="两轮车" />
              </label>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Move up" disabled={index === 0}
                  onClick={() => setDraft((l) => moveGroup(l, g.id, -1))}
                  className="p-2 rounded-lg hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"><ArrowUp className="w-4 h-4" /></button>
                <button type="button" aria-label="Move down" disabled={index === draft.length - 1}
                  onClick={() => setDraft((l) => moveGroup(l, g.id, 1))}
                  className="p-2 rounded-lg hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"><ArrowDown className="w-4 h-4" /></button>
                <button type="button" aria-label="Remove group"
                  disabled={inUse > 0 || draft.length <= 1}
                  title={inUse > 0 ? `${inUse} categor${inUse === 1 ? 'y uses' : 'ies use'} this group. Move them first.` : 'Remove group'}
                  onClick={() => setDraft((l) => l.filter((x) => x.id !== g.id))}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="lg:col-span-4 text-[10px] text-zinc-400">
                Identifier: <code>{g.id}</code> · {inUse} categor{inUse === 1 ? 'y' : 'ies'}
              </p>
            </li>
          );
        })}
      </ul>

      {dirty && errors.length > 0 && (
        <ul className="text-xs text-red-600 space-y-0.5" role="alert">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}
    </section>
  );
}
