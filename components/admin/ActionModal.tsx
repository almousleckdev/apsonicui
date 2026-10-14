'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActionModalVariant = 'danger' | 'warning' | 'primary' | 'brand';

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ActionModalVariant;
  isLoading?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg';
  expectedConfirmationName?: string;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'brand',
  isLoading = false,
  maxWidth = 'md',
  expectedConfirmationName,
}) => {
  const [typedName, setTypedName] = useState('');

  // Clear the typed confirmation each time the dialog opens. Adjusting state while rendering (instead of in an
  // effect) avoids a render with stale text; see "Adjusting state when a prop changes" in the React docs.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setTypedName('');
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  const confirmColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20',
    primary: 'bg-brand-green hover:bg-green-700 text-white shadow-lg shadow-brand-green/20',
    brand: 'bg-brand-green hover:bg-green-700 text-white shadow-lg shadow-brand-green/20',
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const isNameMatching = !expectedConfirmationName || 
    typedName.trim().toLowerCase() === expectedConfirmationName.trim().toLowerCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && onClose()}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className={cn(
              'relative w-full bg-white rounded-3xl border border-zinc-100 shadow-2xl p-6 sm:p-8 z-10 space-y-5',
              maxWidthClasses[maxWidth]
            )}
          >
            {/* Header & Close */}
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight leading-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              {description}
            </p>

            {/* Name Verification Box if deletion/critical action requires confirmation */}
            {expectedConfirmationName && (
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-zinc-700">
                  Please type <span className="font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 select-all">{expectedConfirmationName}</span> to confirm:
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={`Type "${expectedConfirmationName}" to confirm`}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 font-medium"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading || !isNameMatching}
                className={cn(
                  'px-6 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                  confirmColors[variant]
                )}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{confirmLabel}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export const AdminDialog = ActionModal;
