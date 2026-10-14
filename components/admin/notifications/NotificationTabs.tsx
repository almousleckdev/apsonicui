'use client';

import React from 'react';

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
  const tabs: { id: NotificationStatusTab; label: string; badge?: number; color?: string }[] = [
    { id: 'all', label: 'All Messages / 全部消息' },
    { id: 'unread', label: 'Unread / 未读', badge: unreadCount, color: 'bg-red-500 text-white' },
    { id: 'read', label: 'Read / 已读' },
    { id: 'replied', label: 'Replied / 已回复' },
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
            <span>{t.label}</span>
            {Boolean(t.badge && t.badge > 0) && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${t.color}`}>
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
