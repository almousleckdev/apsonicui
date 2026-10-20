import { COUNTRIES, type AfricaRegion as CanonicalRegion } from '@/lib/data/countries';

export type AfricaRegion = 'west' | 'east' | 'central' | 'southern' | 'other';

export interface CountryRegion {
  country: string;
  isoCode: string;
  region: AfricaRegion;
  presence: 'strong' | 'indirect' | 'coverage';
}

function toLegacyRegion(region?: CanonicalRegion): AfricaRegion {
  if (!region || region === 'north') return 'other';
  return region;
}

export const APSONIC_COUNTRIES_BY_REGION: Record<AfricaRegion, CountryRegion[]> = (() => {
  const grouped: Record<AfricaRegion, CountryRegion[]> = {
    west: [],
    east: [],
    central: [],
    southern: [],
    other: [],
  };

  for (const country of COUNTRIES) {
    const region = toLegacyRegion(country.region);
    const presenceType: 'strong' | 'indirect' | 'coverage' = country.region === 'west' ? 'strong' : 'coverage';

    grouped[region].push({
      country: country.name,
      isoCode: country.iso3,
      region,
      presence: presenceType,
    });
    for (const alias of country.aliases ?? []) {
      grouped[region].push({
        country: alias.charAt(0).toUpperCase() + alias.slice(1),
        isoCode: country.iso3,
        region,
        presence: presenceType,
      });
    }
  }

  return grouped;
})();

export const getRegionByIsoCode = (isoCode: string): AfricaRegion => {
  const codeUpper = isoCode.toUpperCase();
  for (const [region, countries] of Object.entries(APSONIC_COUNTRIES_BY_REGION)) {
    if (countries.some((c) => c.isoCode.toUpperCase() === codeUpper)) {
      return region as AfricaRegion;
    }
  }
  return 'other';
};

export const getCountryRegion = (isoCode: string): CountryRegion | null => {
  const codeUpper = isoCode.toUpperCase();
  for (const countries of Object.values(APSONIC_COUNTRIES_BY_REGION)) {
    const found = countries.find((c) => c.isoCode.toUpperCase() === codeUpper);
    if (found) return found;
  }
  return null;
};

export const getCountryRegionByName = (name: string): CountryRegion | null => {
  const nameLower = name.toLowerCase();
  for (const countries of Object.values(APSONIC_COUNTRIES_BY_REGION)) {
    const found = countries.find((c) => c.country.toLowerCase() === nameLower);
    if (found) return found;
  }
  return null;
};
