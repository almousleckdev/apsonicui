'use client';

import React from 'react';
import { T } from '@/components/admin/T';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

export type NotificationStatusTab = 'all' | 'unread' | 'read' | 'replied';

interface NotificationTabsProps {
  currentTab: NotificationStatusTab;
  onTabChange: (tab: NotificationStatusTab) => void;
  unreadCount: number;
}

export const NotificationTabs: React.FC<NotificationTabsProps> = ({
  currentTab,
  onTabChange,
  unreadCount,
}) => {
  const tabs: { id: NotificationStatusTab; label: AdminKey; badge?: number; color?: string }[] = [
    { id: 'all', label: 'notifications.tabs.all' },
    { id: 'unread', label: 'notifications.tabs.unread', badge: unreadCount, color: 'bg-red-500 text-white' },
    { id: 'read', label: 'notifications.tabs.read' },
    { id: 'replied', label: 'notifications.tabs.replied' },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {tabs.map((t) => {
        const isActive = currentTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <T id={t.label} />
            {Boolean(t.badge && t.badge > 0) && (
              <span className={`px-2 py-0.5 rounded-full text-3xs font-black ${t.color}`}>
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
