/**
 * Mapbox layer management utilities
 * Separates map styling logic from UI components
 */

import type mapboxgl from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';
import { AFRICA_MAP_CONFIG } from '@/lib/constants/africa-map';

const LAYER_IDS = {
  fill: 'africa-countries-fill',
  outline: 'africa-countries-outline',
} as const;

const SOURCE_ID = 'africa-countries';

/**
 * Remove existing layers if they exist
 */
export const removeLayers = (map: mapboxgl.Map): void => {
  if (map.getLayer(LAYER_IDS.fill)) {
    map.removeLayer(LAYER_IDS.fill);
  }
  if (map.getLayer(LAYER_IDS.outline)) {
    map.removeLayer(LAYER_IDS.outline);
  }
};

/**
 * Add or update GeoJSON source
 */
export const updateGeoJSONSource = (
  map: mapboxgl.Map,
  geoJson: FeatureCollection
): void => {
  if (!map) return;

  const sourceExists = map.getSource(SOURCE_ID);
  if (sourceExists) {
    (sourceExists as mapboxgl.GeoJSONSource).setData(geoJson);
  } else {
    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: geoJson,
    });
  }
};

/**
 * Get fill color expression for region-based styling
 */
const getFillColorExpression = (): mapboxgl.Expression => {
  return [
    'case',
    // Priority 1: Red for searched country
    ['==', ['get', 'isSearched'], true],
    AFRICA_MAP_CONFIG.searchHighlightColor,
    // Priority 2: Region-based colors
    ['==', ['get', 'region'], 'west'],
    AFRICA_MAP_CONFIG.regionColors.west,
    ['==', ['get', 'region'], 'east'],
    AFRICA_MAP_CONFIG.regionColors.east,
    ['==', ['get', 'region'], 'central'],
    AFRICA_MAP_CONFIG.regionColors.central,
    ['==', ['get', 'region'], 'southern'],
    AFRICA_MAP_CONFIG.regionColors.southern,
    ['==', ['get', 'region'], 'other'],
    AFRICA_MAP_CONFIG.regionColors.other,
    // Priority 3: Default gray
    AFRICA_MAP_CONFIG.regionColors.default,
  ] as mapboxgl.Expression;
};

/**
 * Get outline color expression
 */
const getOutlineColorExpression = (): mapboxgl.Expression => {
  return [
    'case',
    ['==', ['get', 'isSearched'], true],
    AFRICA_MAP_CONFIG.searchHighlightColor,
    ['==', ['get', 'region'], 'west'],
    AFRICA_MAP_CONFIG.regionColors.west,
    ['==', ['get', 'region'], 'east'],
    AFRICA_MAP_CONFIG.regionColors.east,
    ['==', ['get', 'region'], 'central'],
    AFRICA_MAP_CONFIG.regionColors.central,
    ['==', ['get', 'region'], 'southern'],
    AFRICA_MAP_CONFIG.regionColors.southern,
    ['==', ['get', 'region'], 'other'],
    AFRICA_MAP_CONFIG.regionColors.other,
    AFRICA_MAP_CONFIG.regionColors.default,
  ] as mapboxgl.Expression;
};

/**
 * Add fill and outline layers with region-based styling
 */
export const addRegionLayers = (map: mapboxgl.Map): void => {
  if (!map.getSource(SOURCE_ID)) {
    console.warn('Source not found, cannot add layers');
    return;
  }

  removeLayers(map);

  // Add fill layer
  map.addLayer({
    id: LAYER_IDS.fill,
    type: 'fill',
    source: SOURCE_ID,
    paint: {
      'fill-color': getFillColorExpression(),
      'fill-opacity': 0.7,
    },
  });

  // Add outline layer
  map.addLayer({
    id: LAYER_IDS.outline,
    type: 'line',
    source: SOURCE_ID,
    paint: {
      'line-color': getOutlineColorExpression(),
      'line-width': 2,
    },
  });
};

/**
 * Update GeoJSON properties for search highlighting
 */
export const updateSearchHighlight = (
  map: mapboxgl.Map,
  geoJson: FeatureCollection,
  searchedCountry: string | null
): FeatureCollection => {
  const updatedFeatures = geoJson.features.map((feature) => {
    const countryName = feature.properties?.name as string;
    const isSearched = searchedCountry
      ? countryName?.toLowerCase() === searchedCountry.toLowerCase()
      : false;

    return {
      ...feature,
      properties: {
        ...feature.properties,
        isSearched,
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features: updatedFeatures,
  };
};

