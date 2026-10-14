// Africa map configuration for Service Support
import { COUNTRIES, CountryInfo, AfricaRegion } from '@/lib/data/countries';

function isoCodesForRegion(region: AfricaRegion): string[] {
  return COUNTRIES.filter((c) => c.region === region).map((c) => c.iso3);
}

const westCodes = isoCodesForRegion('west');
const centralCodes = isoCodesForRegion('central');
const eastCodes = isoCodesForRegion('east');
const southernCodes = isoCodesForRegion('southern');

export const AFRICA_MAP_CONFIG = {
  bounds: {
    africa: [-25, -36, 55, 38] as [number, number, number, number],
  },
  maxBounds: [-30, -40, 65, 45] as [number, number, number, number],
  defaultCenter: [15, 0] as [number, number],
  defaultZoom: 2.8,
  minZoom: 2.5,
  maxZoom: 6,

  countriesByRegion: {
    west: westCodes,
    central: centralCodes,
    east: eastCodes,
    southern: southernCodes,
    westAfrica: westCodes,
    centralAfrica: centralCodes,
    eastAfrica: eastCodes,
    southernAfrica: southernCodes,
  },

  regionColors: {
    west: '#059669',
    central: '#3B82F6',
    east: '#F59E0B',
    southern: '#8B5CF6',
    other: '#71717A',
    default: '#E4E4E7',
  },

  searchHighlightColor: '#EF4444',

  regions: {
    west: {
      color: '#059669',
      hoverColor: '#10B981',
      countries: westCodes,
    },
    central: {
      color: '#3B82F6',
      hoverColor: '#60A5FA',
      countries: centralCodes,
    },
    east: {
      color: '#F59E0B',
      hoverColor: '#FBBF24',
      countries: eastCodes,
    },
    southern: {
      color: '#8B5CF6',
      hoverColor: '#A78BFA',
      countries: southernCodes,
    },
  },

  nonOperationalColor: '#E4E4E7',
  strokeColor: '#FFFFFF',
  strokeWidth: 1.2,

  animation: {
    duration: 1200,
    flyToZoom: 4.5,
  },
};

export const COUNTRY_NAME_MAP: Record<string, string> = COUNTRIES.reduce(
  (map: Record<string, string>, country: CountryInfo) => {
    map[country.name.toLowerCase()] = country.iso3;
    for (const alias of country.aliases ?? []) {
      map[alias.toLowerCase()] = country.iso3;
    }
    return map;
  },
  {} as Record<string, string>
);
