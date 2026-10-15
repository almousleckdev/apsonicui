'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, Globe, ChevronRight, Inbox } from 'lucide-react';
import type { ContactMessageItem } from '@/services/contact';
import { EmptyState } from '@/components/ui/empty-state';

interface NotificationListProps {
  messages: ContactMessageItem[];
  isLoading: boolean;
  onSelectMessage: (msg: ContactMessageItem) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  messages,
  isLoading,
  onSelectMessage,
}) => {
  if (isLoading && messages.length === 0) {
    return (
      <div className="p-16 text-center text-xs font-bold text-zinc-400 bg-white rounded-3xl border border-zinc-100 shadow-sm">
        Loading visitor notifications...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No Messages Found / 暂无消息"
        description="There are currently no visitor contact submissions matching this filter tab."
      />
    );
  }

  return (
    <div className="space-y-3 font-sans">
      {messages.map((msg, index) => {
        const formattedDate = new Date(msg.createdAt).toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => onSelectMessage(msg)}
            className={`p-5 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all cursor-pointer flex items-center gap-4 group ${
              !msg.isRead ? 'ring-2 ring-red-500/20 bg-red-50/10' : ''
            }`}
          >
            {/* Status Indicator */}
            <div className="shrink-0">
              {!msg.isRead ? (
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 block ring-4 ring-red-100 animate-pulse" />
              ) : msg.isReplied ? (
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Info Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-zinc-900 group-hover:text-brand-green transition-colors truncate">
                    {msg.firstName} {msg.lastName}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-2xs font-bold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                    <Globe className="w-3 h-3 text-zinc-400" />
                    {msg.country || 'Global'}
                  </span>
                </div>
                <span className="text-2xs font-semibold text-zinc-400 shrink-0">{formattedDate}</span>
              </div>

              <p className="text-xs font-bold text-zinc-800 truncate mt-1">{msg.subject}</p>
              <p className="text-xs text-zinc-500 truncate font-medium mt-0.5">{msg.message}</p>
            </div>

            {/* Status Badge Tag */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {!msg.isRead && (
                <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-red-100 text-red-700">
                  Unread
                </span>
              )}
              {msg.isRead && !msg.isReplied && (
                <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-blue-100 text-blue-700">
                  Read
                </span>
              )}
              {msg.isReplied && (
                <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-emerald-100 text-emerald-800">
                  Replied
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
