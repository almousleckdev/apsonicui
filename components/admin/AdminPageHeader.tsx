'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, RefreshCw, LucideIcon } from 'lucide-react';

export interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  actionIcon?: LucideIcon;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actionVariant?: 'primary' | 'danger';
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  actionHref,
  onActionClick,
  actionIcon: ActionIcon = Plus,
  onRefresh,
  isRefreshing = false,
  actionVariant = 'primary',
}) => {
  const buttonVariantClass = actionVariant === 'danger'
    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700'
    : 'bg-brand-green text-white shadow-lg shadow-brand-green/20 hover:bg-green-700';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">{title}</h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}

        {actionLabel && (
          actionHref ? (
            <Link
              href={actionHref}
              className={`inline-flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all transform hover:-translate-y-0.5 cursor-pointer ${buttonVariantClass}`}
            >
              <ActionIcon className="w-4 h-4" />
              <span>{actionLabel}</span>
            </Link>
          ) : onActionClick ? (
            <button
              type="button"
              onClick={onActionClick}
              className={`inline-flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all transform hover:-translate-y-0.5 cursor-pointer ${buttonVariantClass}`}
            >
              <ActionIcon className="w-4 h-4" />
              <span>{actionLabel}</span>
            </button>
          ) : null
        )}
      </div>
    </div>
  );
};
