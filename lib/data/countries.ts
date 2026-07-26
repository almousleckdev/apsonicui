// Canonical source of truth for African country reference data. Previously
// this same information (name, ISO code, region, flag) was hand-duplicated
// across lib/constants/africa-map.ts, lib/utils/africa-regions.ts,
// lib/utils/country-mapping.ts, lib/utils/country-flags.ts, and the coverage
// lists in lib/data/contact-page.ts / lib/data/service-page.ts - and they had
// already drifted (e.g. no "southern" region existed in one of them). Every
// one of those now derives its lookups from this single array.
//
// `presence` reflects the original APSONIC_COUNTRIES_BY_REGION business
// classification where one existed; countries that only ever appeared in the
// map's region-coloring config (never in that business list) default to
// 'coverage' - the most conservative tier - rather than overstating presence.

export type AfricaRegion = 'west' | 'east' | 'central' | 'southern' | 'north';
export type ApsonicPresence = 'strong' | 'indirect' | 'coverage';

export interface Country {
  iso3: string;
  name: string;
  flag: string;
  region: AfricaRegion;
  presence: ApsonicPresence;
  /** Alternate names/spellings this country should be found by in free-text search. */
  aliases?: string[];
}

export const COUNTRIES: Country[] = [
  // West Africa
  { iso3: 'GHA', name: 'Ghana', flag: '🇬🇭', region: 'west', presence: 'strong' },
  { iso3: 'TGO', name: 'Togo', flag: '🇹🇬', region: 'west', presence: 'strong' },
  { iso3: 'BEN', name: 'Benin', flag: '🇧🇯', region: 'west', presence: 'strong', aliases: ['bénin'] },
  { iso3: 'MLI', name: 'Mali', flag: '🇲🇱', region: 'west', presence: 'strong' },
  { iso3: 'GIN', name: 'Guinea', flag: '🇬🇳', region: 'west', presence: 'strong' },
  { iso3: 'BFA', name: 'Burkina Faso', flag: '🇧🇫', region: 'west', presence: 'strong', aliases: ['burkina'] },
  { iso3: 'CIV', name: 'Ivory Coast', flag: '🇨🇮', region: 'west', presence: 'strong', aliases: ["côte d'ivoire"] },
  { iso3: 'SEN', name: 'Senegal', flag: '🇸🇳', region: 'west', presence: 'coverage', aliases: ['sénégal'] },
  { iso3: 'NGA', name: 'Nigeria', flag: '🇳🇬', region: 'west', presence: 'coverage' },
  { iso3: 'GMB', name: 'Gambia', flag: '🇬🇲', region: 'west', presence: 'coverage' },
  { iso3: 'GNB', name: 'Guinea-Bissau', flag: '🇬🇼', region: 'west', presence: 'coverage' },
  { iso3: 'SLE', name: 'Sierra Leone', flag: '🇸🇱', region: 'west', presence: 'coverage' },
  { iso3: 'LBR', name: 'Liberia', flag: '🇱🇷', region: 'west', presence: 'coverage' },
  { iso3: 'NER', name: 'Niger', flag: '🇳🇪', region: 'west', presence: 'coverage' },
  { iso3: 'MRT', name: 'Mauritania', flag: '🇲🇷', region: 'west', presence: 'coverage' },
  { iso3: 'CPV', name: 'Cape Verde', flag: '🇨🇻', region: 'west', presence: 'coverage' },

  // East Africa
  { iso3: 'TZA', name: 'Tanzania', flag: '🇹🇿', region: 'east', presence: 'strong' },
  { iso3: 'KEN', name: 'Kenya', flag: '🇰🇪', region: 'east', presence: 'strong' },
  { iso3: 'UGA', name: 'Uganda', flag: '🇺🇬', region: 'east', presence: 'strong' },
  { iso3: 'ETH', name: 'Ethiopia', flag: '🇪🇹', region: 'east', presence: 'coverage' },
  { iso3: 'SOM', name: 'Somalia', flag: '🇸🇴', region: 'east', presence: 'coverage' },
  { iso3: 'ERI', name: 'Eritrea', flag: '🇪🇷', region: 'east', presence: 'coverage' },
  { iso3: 'DJI', name: 'Djibouti', flag: '🇩🇯', region: 'east', presence: 'coverage' },
  { iso3: 'RWA', name: 'Rwanda', flag: '🇷🇼', region: 'east', presence: 'coverage' },
  { iso3: 'BDI', name: 'Burundi', flag: '🇧🇮', region: 'east', presence: 'coverage' },
  { iso3: 'SSD', name: 'South Sudan', flag: '🇸🇸', region: 'east', presence: 'coverage' },

  // Central Africa
  { iso3: 'CMR', name: 'Cameroon', flag: '🇨🇲', region: 'central', presence: 'indirect' },
  { iso3: 'CAF', name: 'Central African Republic', flag: '🇨🇫', region: 'central', presence: 'indirect', aliases: ['car'] },
  { iso3: 'COG', name: 'Congo', flag: '🇨🇬', region: 'central', presence: 'indirect', aliases: ['republic of congo'] },
  { iso3: 'COD', name: 'Democratic Republic of Congo', flag: '🇨🇩', region: 'central', presence: 'indirect', aliases: ['dr congo', 'drc'] },
  { iso3: 'TCD', name: 'Chad', flag: '🇹🇩', region: 'central', presence: 'coverage' },
  { iso3: 'GNQ', name: 'Equatorial Guinea', flag: '🇬🇶', region: 'central', presence: 'coverage' },
  { iso3: 'GAB', name: 'Gabon', flag: '🇬🇦', region: 'central', presence: 'coverage' },
  { iso3: 'STP', name: 'São Tomé and Príncipe', flag: '🇸🇹', region: 'central', presence: 'coverage' },
  { iso3: 'AGO', name: 'Angola', flag: '🇦🇴', region: 'central', presence: 'coverage' },

  // Southern Africa
  { iso3: 'ZMB', name: 'Zambia', flag: '🇿🇲', region: 'southern', presence: 'coverage' },
  { iso3: 'MWI', name: 'Malawi', flag: '🇲🇼', region: 'southern', presence: 'coverage' },
  { iso3: 'MOZ', name: 'Mozambique', flag: '🇲🇿', region: 'southern', presence: 'coverage' },
  { iso3: 'ZWE', name: 'Zimbabwe', flag: '🇿🇼', region: 'southern', presence: 'coverage' },
  { iso3: 'BWA', name: 'Botswana', flag: '🇧🇼', region: 'southern', presence: 'coverage' },
  { iso3: 'NAM', name: 'Namibia', flag: '🇳🇦', region: 'southern', presence: 'coverage' },
  { iso3: 'ZAF', name: 'South Africa', flag: '🇿🇦', region: 'southern', presence: 'coverage' },
  { iso3: 'LSO', name: 'Lesotho', flag: '🇱🇸', region: 'southern', presence: 'coverage' },
  { iso3: 'SWZ', name: 'Eswatini', flag: '🇸🇿', region: 'southern', presence: 'coverage', aliases: ['swaziland'] },
  { iso3: 'MDG', name: 'Madagascar', flag: '🇲🇬', region: 'southern', presence: 'coverage' },
  { iso3: 'MUS', name: 'Mauritius', flag: '🇲🇺', region: 'southern', presence: 'coverage' },

  // North Africa
  { iso3: 'EGY', name: 'Egypt', flag: '🇪🇬', region: 'north', presence: 'coverage' },
  { iso3: 'TUN', name: 'Tunisia', flag: '🇹🇳', region: 'north', presence: 'coverage' },
];

export function getCountryByIso3(iso3: string): Country | undefined {
  return COUNTRIES.find((c) => c.iso3 === iso3.toUpperCase());
}

export function getCountryByName(name: string): Country | undefined {
  const search = name.toLowerCase().trim();
  return COUNTRIES.find(
    (c) => c.name.toLowerCase() === search || c.aliases?.some((a) => a.toLowerCase() === search)
  );
}

export function getCountriesByRegion(region: AfricaRegion): Country[] {
  return COUNTRIES.filter((c) => c.region === region);
}
