'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { LanguageTabs, suffixOf, type AdminLang } from '@/components/admin/shared/LanguageTabs';
import { PRODUCT_MENU_LIMITS, validateGroup, type ProductMenuGroup } from '@/lib/product-menu/groups';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** The group being edited, or null to create one. */
  group: ProductMenuGroup | null;
  /** Saves the group; rejects with an Error whose message is shown to the admin. */
  onSave: (group: ProductMenuGroup) => Promise<void>;
}

const PLACEHOLDER: Record<AdminLang, string> = { en: 'e.g. Two-wheeler', fr: 'p. ex. Deux-roues', zh: '例如：两轮车' };
const EMPTY: ProductMenuGroup = { id: '', labelEn: '', labelFr: '', labelZh: '', image: '' };

export function GroupFormModal({ isOpen, onClose, group, onSave }: Props) {
  // The form is a child keyed by the group, so each opening starts from a clean draft without effects.
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={group ? 'Edit menu group' : 'Add menu group'} maxWidthClass="max-w-lg">
      <GroupForm key={group?.id ?? 'new'} group={group} onCancel={onClose} onSave={onSave} />
    </Modal>
  );
}

function GroupForm({ group, onCancel, onSave }: { group: ProductMenuGroup | null; onCancel: () => void; onSave: Props['onSave'] }) {
  const [draft, setDraft] = useState<ProductMenuGroup>(group ?? EMPTY);
  const [lang, setLang] = useState<AdminLang>('en');
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const nameKey = `label${suffixOf(lang)}` as 'labelEn' | 'labelFr' | 'labelZh';
  const errors = validateGroup(draft);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (errors.length > 0) {
      if (!draft.labelEn.trim()) setLang('en');
      return;
    }
    setSaving(true);
    setServerError('');
    try {
      await onSave({
        ...draft,
        labelEn: draft.labelEn.trim(),
        labelFr: draft.labelFr.trim(),
        labelZh: draft.labelZh.trim(),
        image: draft.image.trim(),
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Could not save the group');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-xs font-medium font-sans" noValidate>
      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <label htmlFor="group-name" className="font-bold text-zinc-700">Name {lang === 'en' && '*'}</label>
          <LanguageTabs value={lang} onChange={setLang} />
        </div>
        <input
          id="group-name"
          type="text"
          autoFocus
          value={draft[nameKey]}
          maxLength={PRODUCT_MENU_LIMITS.label}
          onChange={(e) => setDraft((d) => ({ ...d, [nameKey]: e.target.value }))}
          placeholder={PLACEHOLDER[lang]}
          className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
        />
        <p className="mt-1 text-2xs text-zinc-400">
          {lang === 'en' ? 'Shown in the Products menu.' : 'If empty, visitors using this language see the English name.'}
        </p>
      </div>

      <div>
        <p className="mb-1 font-bold text-zinc-700">Picture *</p>
        <CompactMediaField value={draft.image} onChange={(url) => setDraft((d) => ({ ...d, image: url }))} />
      </div>

      {attempted && errors.length > 0 && (
        <ul role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-2xs text-red-700 space-y-0.5">
          {errors.map((m) => <li key={m}>{m}</li>)}
        </ul>
      )}
      {serverError && <p role="alert" className="text-2xs font-medium text-red-600">{serverError}</p>}

      <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
        <button type="submit" disabled={saving} className="px-5 py-2 bg-brand-green hover:bg-green-700 text-white font-bold text-xs rounded-xl disabled:opacity-60 cursor-pointer">
          {saving ? 'Saving…' : group ? 'Save changes' : 'Add group'}
        </button>
      </div>
    </form>
  );
}
