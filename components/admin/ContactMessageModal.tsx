'use client';

import React from 'react';
import { Mail, Phone, Globe, User, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import type { ContactMessageItem } from '@/services/contact';
import { markAdminContactReplied, markAdminContactRead } from '@/services/contact';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface ContactMessageModalProps {
  message: ContactMessageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

export const ContactMessageModal: React.FC<ContactMessageModalProps> = ({
  message,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const { t } = useAdminText();
  if (!message) return null;

  const handleReplyClick = async () => {
    const mailtoUrl = `mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`;
    window.open(mailtoUrl, '_blank');

    try {
      await markAdminContactReplied(message.id, true);
      onStatusChange?.();
    } catch (err) {
      console.error('Failed to mark as replied', err);
    }
  };

  const handleToggleRead = async () => {
    try {
      await markAdminContactRead(message.id, !message.isRead);
      onStatusChange?.();
    } catch (err) {
      console.error('Failed to toggle read state', err);
    }
  };

  const formattedDate = new Date(message.createdAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="space-y-6 font-sans">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900"><T id="notifications.modal.title" /></h3>
              <p className="text-xs text-zinc-400 font-semibold">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
          <div className="flex items-center gap-2">
            {!message.isRead && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> <T id="notifications.unread" />
              </span>
            )}
            {message.isRead && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> <T id="notifications.read" />
              </span>
            )}
            {message.isReplied && (
              <span className="inline-flex items-center gap-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1">
                <Send className="w-3 h-3" /> <T id="notifications.replied" />
              </span>
            )}
          </div>
          <button
            onClick={handleToggleRead}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
          >
            {t('notifications.modal.markAs', { state: t(message.isRead ? 'notifications.unread' : 'notifications.read') })}
          </button>
        </div>

        {/* Visitor Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
            <User className="w-4 h-4 text-brand-green shrink-0" />
            <div>
              <p className="text-3xs font-bold text-zinc-400 uppercase tracking-wider"><T id="notifications.modal.visitorName" /></p>
              <p className="text-xs font-extrabold text-zinc-900">{message.firstName} {message.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
            <Globe className="w-4 h-4 text-brand-green shrink-0" />
            <div>
              <p className="text-3xs font-bold text-zinc-400 uppercase tracking-wider"><T id="notifications.modal.country" /></p>
              <p className="text-xs font-extrabold text-zinc-900">{message.country || t('notifications.modal.na')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
            <Mail className="w-4 h-4 text-brand-green shrink-0" />
            <div>
              <p className="text-3xs font-bold text-zinc-400 uppercase tracking-wider"><T id="notifications.modal.email" /></p>
              <a href={`mailto:${message.email}`} className="text-xs font-extrabold text-brand-green hover:underline">
                {message.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
            <Phone className="w-4 h-4 text-brand-green shrink-0" />
            <div>
              <p className="text-3xs font-bold text-zinc-400 uppercase tracking-wider"><T id="notifications.modal.phone" /></p>
              <p className="text-xs font-extrabold text-zinc-900">{message.phone || t('notifications.modal.na')}</p>
            </div>
          </div>
        </div>

        {/* Subject & Department */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider"><T id="notifications.modal.subject" /></p>
            <span className="text-3xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
              {message.department}
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-zinc-900">{message.subject}</h4>
        </div>

        {/* Message Body */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider"><T id="notifications.modal.content" /></p>
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700 leading-relaxed font-medium whitespace-pre-wrap">
            {message.message}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-full text-xs font-bold px-6 h-10 border-zinc-200"
          >
            <T id="common.close" />
          </Button>

          <Button
            onClick={handleReplyClick}
            variant="brand"
            className="rounded-full text-xs font-bold px-6 h-10 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span><T id="notifications.modal.reply" /></span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
