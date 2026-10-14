'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  locale: string;
  onLanguageChange: (lang: string) => void;
  isTransparentPage: boolean;
  isScrolled: boolean;
  ariaLabel?: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中' },
  { value: 'fr', label: 'Fr' },
  { value: 'en', label: 'En' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  locale,
  onLanguageChange,
  isTransparentPage,
  isScrolled,
  ariaLabel = 'Select Language',
}) => {
  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => onLanguageChange(e.target.value)}
        className={cn(
          'appearance-none rounded-full outline-none border transition-all duration-200 text-center font-semibold text-xs px-5 h-9 cursor-pointer focus:ring-2 focus:ring-brand-green/30',
          isTransparentPage && !isScrolled
            ? 'bg-white/10 border-white/20 text-white focus:bg-white/20 focus:border-white/40'
            : 'bg-[#046e3e] border-[#035932] text-white focus:bg-[#035932] focus:border-[#024627]'
        )}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }}
        aria-label={ariaLabel}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-[#058B4F] text-white text-left font-sans"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
