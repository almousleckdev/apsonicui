'use client';

import React, { useState } from 'react';
import { useRemoteList } from '@/hooks/queries/useRemoteList';
import { useUnreadContactCount } from '@/hooks/queries/useUnreadContactCount';
import { RefreshCw } from 'lucide-react';
import type { ContactMessageItem } from '@/services/contact';
import {
  fetchAdminContactMessages,
  markAdminContactRead,
} from '@/services/contact';
import { AdminBackNav } from '@/components/admin/AdminBackNav';
import { NotificationTabs, NotificationStatusTab } from '@/components/admin/notifications/NotificationTabs';
import { NotificationList } from '@/components/admin/notifications/NotificationList';
import { ContactMessageModal } from '@/components/admin/ContactMessageModal';
import { T } from '@/components/admin/T';

export default function AdminNotificationsPage() {
  const [currentTab, setCurrentTab] = useState<NotificationStatusTab>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);

  const { data: messages, loading: isLoading, refetch: refetchMessages } = useRemoteList<ContactMessageItem>(
    ['admin', 'contact', 'messages', currentTab],
    async () => (await fetchAdminContactMessages(currentTab, 0, 50)).data?.content ?? [],
    (err) => console.error('Failed to load notifications', err)
  );
  const { data: unreadCount = 0, refetch: refetchUnread } = useUnreadContactCount();
  const loadData = () => Promise.all([refetchMessages(), refetchUnread()]);

  const handleSelectMessage = async (msg: ContactMessageItem) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await markAdminContactRead(msg.id, true);
        loadData();
      } catch (err) {
        console.error('Failed to mark as read', err);
      }
    }
  };

  return (
    <>
      <div className="space-y-6 font-sans max-w-7xl mx-auto">
        {/* Top Control Bar using standard AdminBackNav */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <AdminBackNav href="/admin/dashboard" />
            <span className="text-zinc-300">|</span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <T id="notifications.title" />
            </span>
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span><T id="common.refresh" /></span>
          </button>
        </div>

        {/* 4 Clean Tabs */}
        <NotificationTabs
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          unreadCount={unreadCount}
        />

        {/* Message List */}
        <NotificationList
          messages={messages}
          isLoading={isLoading}
          onSelectMessage={handleSelectMessage}
        />

        {/* Message Modal */}
        <ContactMessageModal
          message={selectedMessage}
          isOpen={Boolean(selectedMessage)}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={loadData}
        />
      </div>
    </>
  );
}
