// Country ISO code mapping utilities
import { COUNTRY_NAME_MAP } from '@/lib/constants/africa-map';
import { getCountryByIso3 } from '@/lib/data/countries';

export const getCountryISOCode = (countryName: string): string | null => {
  const searchLower = countryName.toLowerCase().trim();

  // Direct mapping lookup
  let countryCode = COUNTRY_NAME_MAP[searchLower];

  // Partial match fallback
  if (!countryCode) {
    for (const [key, code] of Object.entries(COUNTRY_NAME_MAP)) {
      const keyLower = key.toLowerCase();
      if (keyLower === searchLower ||
          keyLower.includes(searchLower) ||
          searchLower.includes(keyLower) ||
          keyLower.startsWith(searchLower) ||
          searchLower.startsWith(keyLower)) {
        countryCode = code;
        break;
      }
    }
  }

  return countryCode || null;
};

export const getCountryNameFromISOCode = (code: string): string => {
  return getCountryByIso3(code)?.name || '';
};
