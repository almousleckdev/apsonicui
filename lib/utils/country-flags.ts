/**
 * Country flag emoji lookup, derived from lib/data/countries.ts
 */
import { getCountryByName } from '@/lib/data/countries';

/**
 * Get flag emoji for a country name
 */
export const getCountryFlag = (countryName: string): string => {
  return getCountryByName(countryName)?.flag || '📍';
};
