/**
 * Geometry helpers for the Africa map. Pure functions (no map, no network), so they are easy to test.
 */
import type { Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson';

export type LngLatBounds = [[number, number], [number, number]];
type Ring = number[][];

const polygonsOf = (feature: Feature): Ring[][] => {
  const geometry = feature.geometry as Polygon | MultiPolygon | null;
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates as Ring[]];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates as Ring[][];
  return [];
};

const ringBounds = (ring: Ring): LngLatBounds => {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const [lng, lat] of ring) {
    if (lng < west) west = lng;
    if (lng > east) east = lng;
    if (lat < south) south = lat;
    if (lat > north) north = lat;
  }
  return [[west, south], [east, north]];
};

const boundsArea = ([[w, s], [e, n]]: LngLatBounds): number => (e - w) * (n - s);

/**
 * Bounds of the biggest piece of a country. A country made of a mainland and far islands (Tanzania with Zanzibar,
 * Equatorial Guinea...) would otherwise be framed around the empty sea between them.
 */
export const getMainlandBounds = (feature: Feature): LngLatBounds | null => {
  let best: LngLatBounds | null = null;
  for (const polygon of polygonsOf(feature)) {
    if (!polygon[0] || polygon[0].length === 0) continue;
    const bounds = ringBounds(polygon[0]);
    if (!best || boundsArea(bounds) > boundsArea(best)) best = bounds;
  }
  return best;
};

/** Ray casting: is the point inside the ring? */
const inRing = (lng: number, lat: number, ring: Ring): boolean => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

/** Inside the outer ring and not inside a hole (an enclave such as Lesotho inside South Africa). */
export const pointInFeature = (feature: Feature, lng: number, lat: number): boolean =>
  polygonsOf(feature).some(([outer, ...holes]) => outer && inRing(lng, lat, outer) && !holes.some((hole) => inRing(lng, lat, hole)));

export const findFeatureContaining = (collection: FeatureCollection, lng: number, lat: number): Feature | null =>
  collection.features.find((feature) => pointInFeature(feature, lng, lat)) ?? null;
