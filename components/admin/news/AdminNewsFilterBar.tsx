'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

interface AdminNewsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CATEGORIES: Array<{ value: string; label: AdminKey }> = [
  { value: 'ALL', label: 'news.allCategories' },
  { value: 'Corporate', label: 'news.categories.Corporate' },
  { value: 'Events', label: 'news.categories.Events' },
  { value: 'Product Launch', label: 'news.categories.Product Launch' },
  { value: 'CSR', label: 'news.categories.CSR' },
];

export const AdminNewsFilterBar: React.FC<AdminNewsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useAdminText();
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm font-sans">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder={t('news.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-brand-green font-medium"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        {CATEGORIES.map(({ value, label }) => {
          const isSelected = selectedCategory === value;
          return (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <T id={label} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
