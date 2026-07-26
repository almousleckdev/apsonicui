/**
 * Africa region mapping for APSONIC presence, derived from lib/data/countries.ts.
 *
 * Note on 'southern': this file's map-color consumer (lib/utils/map-layers.ts)
 * only paints west/east/central/southern/other - the canonical data's 'north'
 * region (Egypt, Tunisia) has no dedicated map color, so it's folded into
 * 'other' here, matching how those two countries were already classified
 * before this consolidation.
 */
import { COUNTRIES, type AfricaRegion as CanonicalRegion } from '@/lib/data/countries';

export type AfricaRegion = 'west' | 'east' | 'central' | 'southern' | 'other';

export interface CountryRegion {
  country: string;
  isoCode: string;
  region: AfricaRegion;
  presence: 'strong' | 'indirect' | 'coverage';
}

function toLegacyRegion(region: CanonicalRegion): AfricaRegion {
  return region === 'north' ? 'other' : region;
}

/**
 * Countries with APSONIC presence by region, derived from the canonical list.
 */
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
    grouped[region].push({
      country: country.name,
      isoCode: country.iso3,
      region,
      presence: country.presence,
    });
    for (const alias of country.aliases ?? []) {
      grouped[region].push({
        country: alias.charAt(0).toUpperCase() + alias.slice(1),
        isoCode: country.iso3,
        region,
        presence: country.presence,
      });
    }
  }

  return grouped;
})();

/**
 * Get region for a country by ISO code
 */
export const getCountryRegion = (isoCode: string): AfricaRegion | null => {
  for (const region of Object.keys(APSONIC_COUNTRIES_BY_REGION) as AfricaRegion[]) {
    const found = APSONIC_COUNTRIES_BY_REGION[region].find(
      (country) => country.isoCode === isoCode
    );
    if (found) {
      return found.region;
    }
  }
  return null;
};

/**
 * Get region for a country by country name
 */
export const getCountryRegionByName = (countryName: string): AfricaRegion | null => {
  const searchLower = countryName.toLowerCase().trim();

  for (const region of Object.keys(APSONIC_COUNTRIES_BY_REGION) as AfricaRegion[]) {
    const found = APSONIC_COUNTRIES_BY_REGION[region].find(
      (country) => country.country.toLowerCase() === searchLower
    );
    if (found) {
      return found.region;
    }
  }
  return null;
};

/**
 * Check if a country has APSONIC presence
 */
export const hasApsonicPresence = (isoCode: string): boolean => {
  return getCountryRegion(isoCode) !== null;
};
