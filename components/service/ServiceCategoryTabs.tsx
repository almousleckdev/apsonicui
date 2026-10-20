'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { CategoryData } from '@/lib/data/service-detail-data';
import { cn } from '@/lib/utils';

interface ServiceCategoryTabsProps {
  categories: string[];
  data: Record<string, CategoryData>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isHeaderVisible: boolean;
}

export const ServiceCategoryTabs: React.FC<ServiceCategoryTabsProps> = ({
  categories,
  data,
  selectedCategory,
  onSelectCategory,
  isHeaderVisible,
}) => {
  if (categories.length <= 1) return null;

  return (
    <div
      className={cn(
        'sticky transition-all duration-300 z-40 bg-white/95 border-b border-zinc-200/50 backdrop-blur-md shadow-sm font-sans',
        isHeaderVisible ? 'top-20' : 'top-0'
      )}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 sm:gap-12 overflow-x-auto no-scrollbar justify-start sm:justify-center">
          {categories.map((key) => (
            <button
              key={key}
              onClick={() => onSelectCategory(key)}
              className={cn(
                'px-1 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all relative cursor-pointer whitespace-nowrap',
                selectedCategory === key ? 'text-brand-green' : 'text-zinc-400 hover:text-zinc-900'
              )}
            >
              {data[key].title}
              {selectedCategory === key && (
                <motion.div
                  layoutId="activeSubTab"
                  className="absolute bottom-0 inset-x-0 h-[3px] bg-brand-green rounded-full shadow-[0_0_8px_rgba(31,168,79,0.4)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
