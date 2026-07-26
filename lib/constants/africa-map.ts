// Africa map configuration for Service Support
import { COUNTRIES } from '@/lib/data/countries';

function isoCodesForRegion(region: 'west' | 'east' | 'central' | 'southern'): string[] {
  return COUNTRIES.filter((c) => c.region === region).map((c) => c.iso3);
}

export const AFRICA_MAP_CONFIG = {
  // Map bounds for Africa continent
  bounds: {
    // Tighter Africa continent bounds [west, south, east, north]
    africa: [-25, -36, 55, 38] as [number, number, number, number],
  },

  // Strict bounds to keep view on Africa
  maxBounds: [-30, -40, 65, 45] as [number, number, number, number],

  // Refined default view
  defaultCenter: [15, 0] as [number, number],
  defaultZoom: 2.8,
  minZoom: 2.0,

  // Region colors for APSONIC presence highlighting
  regionColors: {
    west: '#10B981', // Green - Strong presence
    east: '#EAB308', // Yellow
    central: '#F97316', // Orange
    southern: '#8B5CF6', // Purple - matches the original "Southern Africa - Purple" intent that was never wired into the color map (see lib/utils/map-layers.ts)
    other: '#3B82F6', // Blue - Coverage/Parts
    default: '#CFD8DC', // Gray - No presence
  },

  // Countries by region (ISO 3166-1 alpha-3 codes), derived from lib/data/countries.ts
  countriesByRegion: {
    westAfrica: isoCodesForRegion('west'),
    eastAfrica: isoCodesForRegion('east'),
    centralAfrica: isoCodesForRegion('central'),
    southernAfrica: isoCodesForRegion('southern'),
  },

  // Search highlight color (when searching for a country)
  searchHighlightColor: '#EF4444', // Red

  // Animation settings
  animation: {
    duration: 1500, // milliseconds
    easing: 0.5, // easing factor
  },
} as const;

// Country name mappings for search (supports English and French), derived
// from lib/data/countries.ts (name + aliases -> ISO3).
export const COUNTRY_NAME_MAP: Record<string, string> = COUNTRIES.reduce(
  (map, country) => {
    map[country.name.toLowerCase()] = country.iso3;
    for (const alias of country.aliases ?? []) {
      map[alias.toLowerCase()] = country.iso3;
    }
    return map;
  },
  {} as Record<string, string>
);
