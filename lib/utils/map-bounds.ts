/**
 * Map bounds calculation utilities
 * Separates bounds logic from UI components
 */

import type { Feature } from 'geojson';

/**
 * Calculate bounds from polygon coordinates
 */
export const calculateBoundsFromPolygon = (
  coordinates: [number, number][]
): [[number, number], [number, number]] => {
  return coordinates.reduce(
    (acc: [[number, number], [number, number]], coord: [number, number]): [[number, number], [number, number]] => {
      return [
        [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])] as [number, number],
        [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])] as [number, number],
      ];
    },
    [[Infinity, Infinity], [-Infinity, -Infinity]] as [[number, number], [number, number]]
  );
};

/**
 * Get bounds from GeoJSON feature, supporting both Polygon and MultiPolygon geometry shapes
 */
export const getBoundsFromFeature = (
  feature: Feature
): [[number, number], [number, number]] | null => {
  const geom = feature.geometry;
  if (!geom) return null;

  if (geom.type === 'Polygon') {
    const coordinates = geom.coordinates[0] as [number, number][];
    return calculateBoundsFromPolygon(coordinates);
  }

  if (geom.type === 'MultiPolygon') {
    let allCoords: [number, number][] = [];
    for (const polygon of geom.coordinates) {
      if (polygon[0]) {
        allCoords = allCoords.concat(polygon[0] as [number, number][]);
      }
    }
    if (allCoords.length === 0) return null;
    return calculateBoundsFromPolygon(allCoords);
  }

  return null;
};
