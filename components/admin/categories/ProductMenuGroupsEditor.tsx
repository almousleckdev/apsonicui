'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { CollapsibleCard } from '@/components/admin/shared/CollapsibleCard';
import { LanguageTabs, suffixOf, type AdminLang } from '@/components/admin/shared/LanguageTabs';
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

const PLACEHOLDER: Record<AdminLang, string> = { en: 'e.g. Two-wheeler', fr: 'p. ex. Deux-roues', zh: '例如：两轮车' };
const INPUT = 'w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 focus:bg-white focus:outline-none text-xs';

export function ProductMenuGroupsEditor({ groups, categories, onSaved }: Props) {
  const { toast } = useToast();
  const [lang, setLang] = useState<AdminLang>('en');
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
  const labelKey = `label${suffixOf(lang)}` as 'labelEn' | 'labelFr' | 'labelZh';

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
      const cleaned = draft.map((g) => ({ ...g, labelEn: g.labelEn.trim(), labelFr: g.labelFr.trim(), labelZh: g.labelZh.trim() }));
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
    <CollapsibleCard
      title="Products menu groups"
      summary={draft.map((g) => g.labelEn || g.id).join(' · ')}
      actions={
        <>
          <LanguageTabs value={lang} onChange={setLang} />
          <button type="button" onClick={add} disabled={draft.length >= PRODUCT_MENU_LIMITS.maxGroups} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-50 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
          <button type="button" onClick={save} disabled={saving || !dirty || errors.length > 0} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-brand-green text-white hover:opacity-90 disabled:opacity-50 cursor-pointer">
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save'}
          </button>
        </>
      }
    >
      <p className="mb-2 text-[11px] text-zinc-400">
        The left-hand list of the Products dropdown. Pick a group for each category below.
        {lang !== 'en' && ' Empty names show the English text to visitors.'}
      </p>
      <ul className="divide-y divide-zinc-100">
        {draft.map((g, index) => {
          const inUse = usage[g.id] ?? 0;
          return (
            <li key={g.id} className="flex items-center gap-2 py-1.5">
              <input
                className={INPUT}
                value={g[labelKey]}
                maxLength={PRODUCT_MENU_LIMITS.label}
                onChange={(e) => patch(g.id, { [labelKey]: e.target.value })}
                placeholder={PLACEHOLDER[lang]}
                aria-label={`Group name (${lang})`}
              />
              <span className="hidden sm:inline shrink-0 w-28 text-[10px] text-zinc-400 truncate" title={g.id}>
                {inUse} categor{inUse === 1 ? 'y' : 'ies'}
              </span>
              <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => setDraft((l) => moveGroup(l, g.id, -1))} className="p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
              <button type="button" aria-label="Move down" disabled={index === draft.length - 1} onClick={() => setDraft((l) => moveGroup(l, g.id, 1))} className="p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
              <button
                type="button"
                aria-label="Remove group"
                disabled={inUse > 0 || draft.length <= 1}
                title={inUse > 0 ? `${inUse} categor${inUse === 1 ? 'y uses' : 'ies use'} this group. Move them first.` : 'Remove group'}
                onClick={() => setDraft((l) => l.filter((x) => x.id !== g.id))}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              ><Trash2 className="w-3.5 h-3.5" /></button>
            </li>
          );
        })}
      </ul>
      {dirty && errors.length > 0 && (
        <ul className="mt-2 text-xs text-red-600 space-y-0.5" role="alert">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}
    </CollapsibleCard>
  );
}
