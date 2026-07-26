// Country search utilities - replace STORES with fetchStores() when backend ready
import { COUNTRY_NAME_MAP } from '@/lib/constants/africa-map';
import { STORES } from '@/lib/data/stores';
import { getCountryNameFromISOCode } from './country-mapping';

export const findCountryFromSearch = (searchValue: string): string | null => {
  if (!searchValue.trim()) {
    return null;
  }

  const searchLower = searchValue.toLowerCase().trim();
  
  // Strategy 1: Try direct ISO code mapping
  const countryCode = COUNTRY_NAME_MAP[searchLower];
  if (countryCode) {
    // Find matching country in stores
    const foundCountry = STORES.find(
      (store) => store.country.toLowerCase() === getCountryNameFromISOCode(countryCode).toLowerCase()
    )?.country;
    
    return foundCountry || getCountryNameFromISOCode(countryCode) || searchValue;
  }

  // Strategy 2: Search by country name in stores (partial match)
  const foundCountry = STORES.find(
    (store) => store.country.toLowerCase().includes(searchLower)
  )?.country;

  return foundCountry || null;
};

