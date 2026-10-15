'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { MenuKey } from '@/lib/navigation/types';
import { MenuEditor } from './MenuEditor';

const TABS: Array<{ id: MenuKey; label: string; hint: string }> = [
  { id: 'header', label: 'Header menu', hint: 'The links across the top of every page' },
  { id: 'footer', label: 'Footer menu', hint: 'The link columns at the bottom of every page' },
];

/** Header and footer menus, edited separately. Each has its own draft, preview and publish. */
export function NavigationManager() {
  const { user } = useAuth();
  const [menu, setMenu] = useState<MenuKey>('header');

  if (!user?.permissions?.includes('MANAGE_NAVIGATION')) {
    return (
      <div className="mx-auto max-w-md py-24 text-center font-sans">
        <p className="text-lg font-extrabold text-zinc-900">You do not have access to the navigation</p>
        <p className="mt-2 text-sm text-zinc-500">Ask an administrator to give you the “manage navigation” permission.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 font-sans">
      <AdminPageHeader title="Navigation" subtitle="Choose the links visitors see and where they go. Changes stay private until you publish them." />
      <div role="tablist" aria-label="Menu" className="inline-flex rounded-xl bg-zinc-100 p-0.5">
        {TABS.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={menu === t.id} title={t.hint} onClick={() => setMenu(t.id)}
            className={cn('rounded-lg px-5 py-2 text-xs font-bold transition-colors', menu === t.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}>
            {t.label}
          </button>
        ))}
      </div>
      <MenuEditor key={menu} menu={menu} />
    </div>
  );
}
