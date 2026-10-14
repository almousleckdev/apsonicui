'use client';

import React from 'react';
import { Inbox, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-zinc-100 shadow-sm flex flex-col items-center justify-center gap-3 font-sans">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-1">
        <Icon className="w-7 h-7 stroke-1" />
      </div>
      <h4 className="font-extrabold text-sm text-zinc-900">{title}</h4>
      {description && (
        <p className="text-xs text-zinc-400 font-semibold max-w-sm leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button
            onClick={onAction}
            variant="outline"
            className="rounded-full text-xs font-bold px-6 h-10 border-zinc-200"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
