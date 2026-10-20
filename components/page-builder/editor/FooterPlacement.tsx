'use client';

import React, { useId, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/Toast';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import { useAuth } from '@/hooks/useAuth';
import { navigationService } from '@/services/navigation';
import { getErrorMessage } from '@/lib/utils/errors';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/lib/navigation/types';
import { INPUT_CLASS } from './fields/FieldControl';

const NEW_SECTION = '__new__';

const inFooter = (items: MenuItem[], pageId: number): string | null => {
  for (const section of items) {
    if (section.children.some((c) => c.pageId === pageId)) return section.labels.en ?? '';
  }
  return null;
};

/** "Show this page in the footer": pick a section (column) and the link is added straight away. */
export function FooterPlacement({ pageId }: { pageId: number }) {
  const { user } = useAuth();
  const { t } = useAdminText();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const id = useId();
  const allowed = !!user?.permissions?.includes('MANAGE_NAVIGATION');
  const { data: footer } = useQuery({ queryKey: ['footer-menu'], queryFn: () => navigationService.get('footer'), enabled: allowed });
  const [choice, setChoice] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);

  if (!allowed || !footer) return null;

  const sections = footer.draft.filter((i) => i.kind === 'GROUP' && i.labels.en).map((i) => i.labels.en as string);
  const current = inFooter(footer.draft, pageId);
  const selected = choice || sections[0] || NEW_SECTION;
  const sectionName = (selected === NEW_SECTION ? newName : selected).trim();

  const apply = async (action: () => Promise<void>, success: string) => {
    setBusy(true);
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: ['footer-menu'] });
      queryClient.invalidateQueries({ queryKey: ['site-navigation', 'footer'] });
      setNewName('');
      toast.success(success);
    } catch (e) {
      toast.error(getErrorMessage(e, t('editor.settingsPanel.footerFailed')));
    } finally {
      setBusy(false);
    }
  };

  const toggle = (on: boolean) => {
    if (!on) void apply(() => navigationService.hidePageFromFooter(pageId), t('editor.settingsPanel.footerRemoved'));
    else if (sectionName) void apply(() => navigationService.showPageInFooter(pageId, sectionName), t('editor.settingsPanel.footerAdded'));
    else setChoice(NEW_SECTION);
  };

  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-2xs font-extrabold uppercase tracking-[0.15em] text-zinc-400"><T id="editor.settingsPanel.footer" /></legend>
      {current !== null ? (
        <div className="space-y-2">
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            {t('editor.settingsPanel.footerShow')} · {current}
          </p>
          <button type="button" disabled={busy} onClick={() => toggle(false)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50">
            {t('editor.settingsPanel.footerRemoveBtn')}
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div>
            <label htmlFor={`${id}-section`} className="mb-1 block text-xs font-bold text-zinc-700"><T id="editor.settingsPanel.footerSection" /></label>
            <select id={`${id}-section`} value={selected} onChange={(e) => setChoice(e.target.value)} className={INPUT_CLASS}>
              {sections.map((s) => <option key={s} value={s}>{s}</option>)}
              <option value={NEW_SECTION}>{t('editor.settingsPanel.footerNewSection')}</option>
            </select>
          </div>
          {selected === NEW_SECTION && (
            <div>
              <label htmlFor={`${id}-new`} className="mb-1 block text-xs font-bold text-zinc-700"><T id="editor.settingsPanel.footerNewName" /></label>
              <input id={`${id}-new`} type="text" value={newName} maxLength={60} onChange={(e) => setNewName(e.target.value)}
                placeholder={t('editor.settingsPanel.footerNewPlaceholder')} className={INPUT_CLASS} />
            </div>
          )}
          <button type="button" disabled={busy || !sectionName} onClick={() => toggle(true)}
            className={cn('rounded-lg bg-brand-green px-4 py-2 text-xs font-extrabold text-white hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-50')}>
            {t('editor.settingsPanel.footerAdd')}
          </button>
        </div>
      )}
      <p className="text-2xs text-zinc-400">{t(footer.configured ? 'editor.settingsPanel.footerLive' : 'editor.settingsPanel.footerNotLive')}</p>
    </fieldset>
  );
}
