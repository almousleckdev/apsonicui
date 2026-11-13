// GeoJSON utilities for Africa map - fetches from public GitHub repos
import type { FeatureCollection, Feature } from 'geojson';
import { getApsonicCountryByIso3, isApsonicIso3 } from '@/lib/data/apsonic-countries';

/**
 * GeoJSON source URLs (fallback order)
 */
const GEOJSON_SOURCES = [
  '/data/africa-countries.json',
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
  'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
];

/** Every African country (ISO alpha-3). Used to cut Africa out of a world file when the local file is not available. */
const AFRICAN_ISO3 = new Set([
  'DZA', 'AGO', 'BEN', 'BWA', 'BFA', 'BDI', 'CMR', 'CPV', 'CAF', 'TCD', 'COM', 'COG', 'COD', 'CIV', 'DJI', 'EGY',
  'GNQ', 'ERI', 'SWZ', 'ETH', 'GAB', 'GMB', 'GHA', 'GIN', 'GNB', 'KEN', 'LSO', 'LBR', 'LBY', 'MDG', 'MWI', 'MLI',
  'MRT', 'MUS', 'MAR', 'MOZ', 'NAM', 'NER', 'NGA', 'RWA', 'STP', 'SEN', 'SYC', 'SLE', 'SOM', 'ZAF', 'SSD', 'SDN',
  'TZA', 'TGO', 'TUN', 'UGA', 'ZMB', 'ZWE', 'ESH',
]);

// Extract ISO code from GeoJSON properties
const extractISOCode = (props: Record<string, unknown>): string => {
  return (
    (props['ISO3166-1-Alpha-3'] as string) ||
    (props.ISO_A3 as string) ||
    (props.ISO_A3_EH as string) ||
    (props.ISO3 as string) ||
    (props.iso_a3 as string) ||
    (props.ADM0_A3 as string) ||
    (props.ISO as string) ||
    ''
  );
};

// Extract country name from GeoJSON properties
const extractCountryName = (props: Record<string, unknown>): string => {
  return (
    (props.NAME as string) ||
    (props.name as string) ||
    (props.NAME_LONG as string) ||
    (props.ADMIN as string) ||
    (props.NAME_EN as string) ||
    ''
  );
};

/** Keeps the African countries of a world file. */
const filterAfricanCountries = (worldGeoJson: FeatureCollection): Feature[] =>
  worldGeoJson.features.filter((feature) => AFRICAN_ISO3.has(extractISOCode(feature.properties || {}).toUpperCase()));

/**
 * Gives every country its code, its display name and whether APSONIC is present there ("apsonic").
 * The map colours and the click handling are driven by these properties.
 */
export const processCountryFeatures = (features: Feature[]): Feature[] =>
  features.map((feature) => {
    const props = feature.properties || {};
    const isoCode = extractISOCode(props).toUpperCase();
    const apsonic = isApsonicIso3(isoCode);
    // Countries with APSONIC use our canonical English name (the one the stores and the search box use).
    const name = getApsonicCountryByIso3(isoCode)?.name || extractCountryName(props);

    return {
      ...feature,
      properties: { ...props, name, isoCode, apsonic },
    };
  });

/**
 * Fetch and process African countries GeoJSON
 */
export const fetchAfricanGeoJSON = async (): Promise<FeatureCollection | null> => {
  try {
    let worldGeoJson: FeatureCollection | null = null;
    
    // Try each source in order
    for (const url of GEOJSON_SOURCES) {
      try {
        console.log(`[GeoJSON] Attempting to fetch from: ${url}`);
        const response = await fetch(url);
        if (response.ok) {
          worldGeoJson = await response.json();
          console.log(`[GeoJSON] Successfully fetched GeoJSON from: ${url}`);
          break;
        } else {
          console.warn(`[GeoJSON] Fetch returned status ${response.status} from: ${url}`);
        }
      } catch (error) {
        console.warn(`[GeoJSON] Failed to fetch from ${url}:`, error);
      }
    }

    if (!worldGeoJson) {
      throw new Error('Failed to fetch GeoJSON from all sources');
    }

    // Filter for African countries
    const africanFeatures = filterAfricanCountries(worldGeoJson);

    if (africanFeatures.length === 0) {
      console.warn('No African countries found in GeoJSON');
      return null;
    }

    const processedFeatures = processCountryFeatures(africanFeatures);

    return {
      type: 'FeatureCollection',
      features: processedFeatures,
    };
  } catch (error) {
    console.error('Error fetching African GeoJSON:', error);
    return null;
  }
};

