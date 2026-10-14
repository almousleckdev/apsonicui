'use client';

import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { COUNTRY_LIST, CountryInfo } from '@/lib/data/countries';

interface CountryPickerProps {
  selectedCountryCode: string;
  onSelectCountry: (country: CountryInfo) => void;
  disabled?: boolean;
  error?: string;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountryCode,
  onSelectCountry,
  disabled = false,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const found = COUNTRY_LIST.find((c) => c.code === code) || COUNTRY_LIST[0];
    onSelectCountry(found);
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
        Country / 国家 <span className="text-brand-green font-extrabold">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none z-10 text-sm">
          <Globe className="w-4 h-4 text-zinc-400" />
        </div>

        <select
          value={selectedCountryCode}
          onChange={handleChange}
          disabled={disabled}
          className="flex h-12 w-full appearance-none rounded-2xl pl-11 pr-10 bg-zinc-50 border border-zinc-200 text-zinc-900 focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20 outline-none text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer"
        >
          {COUNTRY_LIST.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>

        <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500 font-semibold pl-1">{error}</p>}
    </div>
  );
};
