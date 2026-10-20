'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  duration?: number;
}

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextType {
  toast: {
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    warning: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'bg-white border-emerald-200 text-zinc-900 shadow-emerald-500/10',
  error: 'bg-white border-red-200 text-zinc-900 shadow-red-500/10',
  warning: 'bg-white border-amber-200 text-zinc-900 shadow-amber-500/10',
  info: 'bg-white border-blue-200 text-zinc-900 shadow-blue-500/10',
};

const ICON_STYLES = {
  success: 'text-emerald-500 bg-emerald-50',
  error: 'text-red-500 bg-red-50',
  warning: 'text-amber-500 bg-amber-50',
  info: 'text-blue-500 bg-blue-50',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      type,
      message,
      title: options?.title,
    };

    setToasts((prev) => [...prev.slice(-4), newToast]);

    const duration = options?.duration ?? 4500;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg: string, opts?: ToastOptions) => addToast('success', msg, opts),
    error: (msg: string, opts?: ToastOptions) => addToast('error', msg, opts),
    warning: (msg: string, opts?: ToastOptions) => addToast('warning', msg, opts),
    info: (msg: string, opts?: ToastOptions) => addToast('info', msg, opts),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none max-w-md w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={cn(
                  'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all font-sans',
                  STYLES[t.type]
                )}
              >
                <div className={cn('p-1.5 rounded-xl shrink-0 mt-0.5', ICON_STYLES[t.type])}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left min-w-0 pr-2">
                  {t.title && (
                    <h4 className="text-xs font-bold text-zinc-900 tracking-tight leading-snug">
                      {t.title}
                    </h4>
                  )}
                  <p className="text-xs text-zinc-600 font-medium leading-relaxed break-words">
                    {t.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
