/**
 * Camera moves for the Africa map. One easing and one style for all of them, so every move feels the same.
 */
import type mapboxgl from 'mapbox-gl';
import type { Feature } from 'geojson';
import { AFRICA_MAP_CONFIG } from '@/lib/constants/africa-map';
import { getMainlandBounds } from '@/lib/utils/map-geometry';

export interface MapPadding {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

/** Slow start, smooth middle, soft landing. */
export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const COUNTRY_MAX_ZOOM = 6.4;
const COUNTRY_MARGIN = 36;

const withDefaults = (padding: MapPadding | undefined, fallback: number): Required<MapPadding> => ({
  top: padding?.top ?? fallback,
  bottom: padding?.bottom ?? fallback,
  left: padding?.left ?? fallback,
  right: padding?.right ?? fallback,
});

/**
 * Flies to a country: a gentle arc (out a little, then in) that lands with the country framed in the free part of the
 * map, beside the side panels. Honours "reduce motion": the browser setting makes Mapbox jump instead of fly.
 */
export const flyToCountry = (map: mapboxgl.Map, feature: Feature, padding?: MapPadding): void => {
  const bounds = getMainlandBounds(feature);
  if (!bounds) return;
  const framing = withDefaults(padding, 50);
  // A little air around the country, so its coast and borders are not touching the edge of the free area.
  const roomy = {
    top: framing.top + COUNTRY_MARGIN,
    bottom: framing.bottom + COUNTRY_MARGIN,
    left: framing.left + COUNTRY_MARGIN,
    right: framing.right + COUNTRY_MARGIN,
  };
  const camera = map.cameraForBounds(bounds, { padding: roomy, maxZoom: COUNTRY_MAX_ZOOM });
  if (!camera?.center) return;
  // `padding` must be given to the move itself: cameraForBounds uses it for the zoom but returns the plain centre,
  // so without it the country would sit in the middle of the whole card, hidden behind the side panels.
  map.flyTo({
    center: camera.center,
    zoom: camera.zoom,
    padding: framing,
    bearing: 0,
    pitch: 0,
    duration: 2400,
    curve: 1.45,
    easing: easeInOutCubic,
  });
};

/** Back to the whole of Africa. `instant` is for the very first frame, so the map does not "move in" on page load. */
export const flyToAfrica = (map: mapboxgl.Map, padding?: MapPadding, instant = false): void => {
  const framing = withDefaults(padding, 10);
  const camera = map.cameraForBounds(AFRICA_MAP_CONFIG.bounds.africa, { padding: framing });
  if (!camera?.center) return;
  if (instant) {
    map.jumpTo({ center: camera.center, zoom: camera.zoom, padding: framing, bearing: 0, pitch: 0 });
    return;
  }
  map.flyTo({
    center: camera.center,
    zoom: camera.zoom,
    padding: framing,
    bearing: 0,
    pitch: 0,
    duration: 1900,
    curve: 1.3,
    easing: easeInOutCubic,
  });
};

/** To a place, when it is not inside any country we have a shape for. */
export const flyToPoint = (map: mapboxgl.Map, lng: number, lat: number, padding?: MapPadding, zoom = 6): void => {
  map.flyTo({
    center: [lng, lat],
    zoom,
    padding: withDefaults(padding, 50),
    bearing: 0,
    pitch: 0,
    duration: 2000,
    curve: 1.4,
    easing: easeInOutCubic,
  });
};
