'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import type { AdminKey } from '@/lib/i18n/admin/catalog';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { MenuKey } from '@/lib/navigation/types';
import { MenuEditor } from './MenuEditor';

const TABS: Array<{ id: MenuKey; label: AdminKey; hint: AdminKey }> = [
  { id: 'header', label: 'navigation.tabs.header', hint: 'navigation.tabs.headerHint' },
  { id: 'footer', label: 'navigation.tabs.footer', hint: 'navigation.tabs.footerHint' },
];

/** Header and footer menus, edited separately. Each has its own draft, preview and publish. */
export function NavigationManager() {
  const { user } = useAuth();
  const { t } = useAdminText();
  const [menu, setMenu] = useState<MenuKey>('header');

  if (!user?.permissions?.includes('MANAGE_NAVIGATION')) {
    return (
      <div className="mx-auto max-w-md py-24 text-center font-sans">
        <p className="text-lg font-extrabold text-zinc-900"><T id="navigation.noAccess" /></p>
        <p className="mt-2 text-sm text-zinc-500"><T id="navigation.noAccessHint" /></p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 font-sans">
      <AdminPageHeader title={<T id="navigation.title" layout="stack" />} subtitle={<T id="navigation.subtitle" />} />
      <div role="tablist" aria-label={t('navigation.menuLabel')} className="inline-flex rounded-xl bg-zinc-100 p-0.5">
        {TABS.map((tab) => (
          <button key={tab.id} role="tab" type="button" aria-selected={menu === tab.id} title={t(tab.hint)} onClick={() => setMenu(tab.id)}
            className={cn('rounded-lg px-5 py-2 text-xs font-bold transition-colors', menu === tab.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}>
            <T id={tab.label} />
          </button>
        ))}
      </div>
      <MenuEditor key={menu} menu={menu} />
    </div>
  );
}
