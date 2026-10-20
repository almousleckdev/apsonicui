import { getCountryByName } from '@/lib/data/countries';

export const getCountryFlag = (countryName: string): string => {
  return getCountryByName(countryName)?.flag || '📍';
};
