// GeoJSON utilities for Africa map - fetches from public GitHub repos
import type { FeatureCollection, Feature } from 'geojson';
import { AFRICA_MAP_CONFIG } from '@/lib/constants/africa-map';
import { getCountryRegion, getCountryRegionByName } from '@/lib/utils/africa-regions';
import { getCountryNameFromISOCode } from './country-mapping';

/**
 * GeoJSON source URLs (fallback order)
 */
const GEOJSON_SOURCES = [
  '/data/africa-countries.json',
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
  'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
];

/**
 * Get all African country ISO codes from config
 */
const getAllAfricanISOCodes = (): string[] => {
  const allCodes = [
    ...AFRICA_MAP_CONFIG.countriesByRegion.westAfrica,
    ...AFRICA_MAP_CONFIG.countriesByRegion.eastAfrica,
    ...AFRICA_MAP_CONFIG.countriesByRegion.centralAfrica,
    ...AFRICA_MAP_CONFIG.countriesByRegion.southernAfrica,
  ];
  return Array.from(new Set(allCodes));
};

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

/**
 * Filter African countries from world GeoJSON
 */
const filterAfricanCountries = (
  worldGeoJson: FeatureCollection,
  africanISOCodes: string[]
): Feature[] => {
  return worldGeoJson.features.filter((feature) => {
    const props = feature.properties || {};
    const isoCode = extractISOCode(props);
    
    // Match by ISO code
    if (isoCode && africanISOCodes.includes(isoCode.toUpperCase())) {
      return true;
    }
    
    // Match by country name
    const name = extractCountryName(props);
    if (name) {
      const nameLower = name.toLowerCase();
      for (const code of africanISOCodes) {
        const countryName = getCountryNameFromISOCode(code);
        if (countryName) {
          const countryNameLower = countryName.toLowerCase();
          if (nameLower === countryNameLower || 
              nameLower.includes(countryNameLower) || 
              countryNameLower.includes(nameLower)) {
            return true;
          }
        }
      }
    }
    
    return false;
  });
};

/**
 * Process features and add region information
 */
export const processFeaturesWithRegions = (
  features: Feature[],
  selectedCountry?: string
): Feature[] => {
  return features.map((feature) => {
    const props = feature.properties || {};
    const isoCode = extractISOCode(props);
    const geoName = extractCountryName(props);
    const countryName = getCountryNameFromISOCode(isoCode) || geoName;
    
    // Get region for this country
    let region = isoCode ? getCountryRegion(isoCode) : null;
    if (!region && countryName) {
      region = getCountryRegionByName(countryName);
    }
    
    const regionValue = (region || 'default') as string;
    const isSearched = selectedCountry 
      ? countryName?.toLowerCase() === selectedCountry.toLowerCase()
      : false;

    return {
      ...feature,
      properties: {
        ...feature.properties,
        name: countryName,
        isoCode: isoCode || '',
        region: regionValue,
        isSearched,
      },
    };
  });
};

/**
 * Fetch and process African countries GeoJSON
 */
export const fetchAfricanGeoJSON = async (
  selectedCountry?: string
): Promise<FeatureCollection | null> => {
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
    const africanISOCodes = getAllAfricanISOCodes();
    const africanFeatures = filterAfricanCountries(worldGeoJson, africanISOCodes);

    if (africanFeatures.length === 0) {
      console.warn('No African countries found in GeoJSON');
      return null;
    }

    // Process features with region information
    const processedFeatures = processFeaturesWithRegions(africanFeatures, selectedCountry);

    return {
      type: 'FeatureCollection',
      features: processedFeatures,
    };
  } catch (error) {
    console.error('Error fetching African GeoJSON:', error);
    return null;
  }
};

