/**
 * Map layers for the Africa map.
 *
 * - Countries where APSONIC is present are drawn in the APSONIC green; the others stay plain.
 * - The selected country (typed, clicked or "nearby") is drawn in red on separate layers, so it can fade in and out
 *   smoothly instead of being repainted with the rest.
 * - Everything sits under the map labels, so place names stay readable.
 */
import type mapboxgl from 'mapbox-gl';
import type { ExpressionSpecification } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';
import { AFRICA_MAP_CONFIG } from '@/lib/constants/africa-map';

export const COUNTRY_SOURCE_ID = 'africa-countries';
export const COUNTRY_FILL_LAYER = 'africa-fill';

const LAYERS = {
  fill: COUNTRY_FILL_LAYER,
  outline: 'africa-outline',
  selectedFill: 'africa-selected-fill',
  selectedGlow: 'africa-selected-glow',
  selectedOutline: 'africa-selected-outline',
} as const;

const GREEN = AFRICA_MAP_CONFIG.apsonicColor;
const GREEN_HOVER = AFRICA_MAP_CONFIG.apsonicHoverColor;
const RED = AFRICA_MAP_CONFIG.searchHighlightColor;

// Nearly opaque, so the red is a clean red and not red mixed with the green underneath.
const SELECTED_FILL_OPACITY = 0.9;
const GLOW_BASE_OPACITY = 0.4;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** A callback that may run after the map was removed (page left): it must never throw. */
const safely = (fn: () => void): void => {
  try {
    fn();
  } catch {
    // the map is gone; nothing left to animate
  }
};

const firstSymbolLayerId = (map: mapboxgl.Map): string | undefined =>
  map.getStyle()?.layers?.find((layer) => layer.type === 'symbol')?.id;

export const removeCountryLayers = (map: mapboxgl.Map): void => {
  for (const id of Object.values(LAYERS)) {
    if (map.getLayer(id)) map.removeLayer(id);
  }
};

/** Adds the countries source, or replaces its data. */
export const updateGeoJSONSource = (map: mapboxgl.Map, geoJson: FeatureCollection): void => {
  const source = map.getSource(COUNTRY_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
  if (source) {
    source.setData(geoJson);
    return;
  }
  // promoteId: the country code is the feature id, which is what hover state is keyed by.
  map.addSource(COUNTRY_SOURCE_ID, { type: 'geojson', data: geoJson, promoteId: 'isoCode' });
};

const NOTHING = ['==', ['get', 'isoCode'], ''] as ExpressionSpecification;

/** Adds all country layers. They start invisible and fade in. */
export const addCountryLayers = (map: mapboxgl.Map): void => {
  if (!map.getSource(COUNTRY_SOURCE_ID)) return;
  removeCountryLayers(map);
  const before = firstSymbolLayerId(map);
  const fadeIn = prefersReducedMotion() ? 0 : 1400;

  map.addLayer(
    {
      id: LAYERS.fill,
      type: 'fill',
      source: COUNTRY_SOURCE_ID,
      paint: {
        'fill-color': [
          'case',
          ['get', 'apsonic'],
          ['case', ['boolean', ['feature-state', 'hover'], false], GREEN_HOVER, GREEN],
          'rgba(0,0,0,0)',
        ] as ExpressionSpecification,
        'fill-opacity': 0,
        'fill-opacity-transition': { duration: fadeIn, delay: 150 },
      },
    },
    before,
  );

  map.addLayer(
    {
      id: LAYERS.outline,
      type: 'line',
      source: COUNTRY_SOURCE_ID,
      paint: {
        'line-color': ['case', ['get', 'apsonic'], '#FFFFFF', '#A1A1AA'] as ExpressionSpecification,
        'line-width': ['case', ['get', 'apsonic'], 1.2, 0.5] as ExpressionSpecification,
        'line-opacity': 0,
        'line-opacity-transition': { duration: fadeIn, delay: 150 },
      },
    },
    before,
  );

  map.addLayer(
    {
      id: LAYERS.selectedFill,
      type: 'fill',
      source: COUNTRY_SOURCE_ID,
      filter: NOTHING,
      paint: { 'fill-color': RED, 'fill-opacity': 0 },
    },
    before,
  );

  map.addLayer(
    {
      id: LAYERS.selectedGlow,
      type: 'line',
      source: COUNTRY_SOURCE_ID,
      filter: NOTHING,
      layout: { 'line-join': 'round' },
      paint: { 'line-color': RED, 'line-width': 10, 'line-blur': 8, 'line-opacity': 0, 'line-opacity-transition': { duration: 0 } },
    },
    before,
  );

  map.addLayer(
    {
      id: LAYERS.selectedOutline,
      type: 'line',
      source: COUNTRY_SOURCE_ID,
      filter: NOTHING,
      layout: { 'line-join': 'round' },
      paint: { 'line-color': RED, 'line-width': 2.5, 'line-opacity': 0 },
    },
    before,
  );

  // Next frame: the layers exist at opacity 0, now the green countries fade in.
  requestAnimationFrame(() =>
    safely(() => {
      map.setPaintProperty(LAYERS.fill, 'fill-opacity', 0.72);
      map.setPaintProperty(LAYERS.outline, 'line-opacity', 0.9);
    }),
  );
};

interface SelectionState {
  iso: string | null;
  timer?: ReturnType<typeof setTimeout>;
  frame?: number;
}

const selections = new WeakMap<mapboxgl.Map, SelectionState>();

const setFilters = (map: mapboxgl.Map, iso: string | null): void => {
  const filter = ['==', ['get', 'isoCode'], iso ?? ''] as mapboxgl.FilterSpecification;
  map.setFilter(LAYERS.selectedFill, filter);
  map.setFilter(LAYERS.selectedGlow, filter);
  map.setFilter(LAYERS.selectedOutline, filter);
};

const setFade = (map: mapboxgl.Map, duration: number, delay = 0): void => {
  const transition = { duration: prefersReducedMotion() ? 0 : duration, delay: prefersReducedMotion() ? 0 : delay };
  map.setPaintProperty(LAYERS.selectedFill, 'fill-opacity-transition', transition);
  map.setPaintProperty(LAYERS.selectedOutline, 'line-opacity-transition', transition);
};

const setVisible = (map: mapboxgl.Map, visible: boolean): void => {
  map.setPaintProperty(LAYERS.selectedFill, 'fill-opacity', visible ? SELECTED_FILL_OPACITY : 0);
  map.setPaintProperty(LAYERS.selectedOutline, 'line-opacity', visible ? 1 : 0);
  map.setPaintProperty(LAYERS.selectedGlow, 'line-opacity', visible ? GLOW_BASE_OPACITY : 0);
};

/** A soft breathing glow on the red outline for a few seconds, then it settles. */
const pulseGlow = (map: mapboxgl.Map, state: SelectionState): void => {
  if (prefersReducedMotion()) return;
  const start = performance.now();
  const tick = (now: number) => {
    const seconds = (now - start) / 1000;
    if (state.iso === null) return;
    if (seconds >= 4.5) {
      safely(() => map.setPaintProperty(LAYERS.selectedGlow, 'line-opacity', GLOW_BASE_OPACITY));
      return;
    }
    // Two slow breaths, eased out so the last one is gentle.
    const strength = Math.pow(1 - seconds / 4.5, 0.6);
    const breath = (Math.sin(seconds * 2 * Math.PI * 0.45 - Math.PI / 2) + 1) / 2;
    safely(() => {
      map.setPaintProperty(LAYERS.selectedGlow, 'line-opacity', GLOW_BASE_OPACITY + 0.3 * breath * strength);
      map.setPaintProperty(LAYERS.selectedGlow, 'line-width', 10 + 6 * breath * strength);
    });
    state.frame = requestAnimationFrame(tick);
  };
  state.frame = requestAnimationFrame(tick);
};

/**
 * Colours a country red with a fade (and clears the previous one). Pass null to clear.
 * The colour starts a moment after the camera starts moving, so the eye follows the move first, then the colour.
 */
export const setSelectedCountry = (map: mapboxgl.Map, iso: string | null): void => {
  if (!map.getLayer(LAYERS.selectedFill)) return;
  const state = selections.get(map) ?? { iso: null };
  if (state.iso === iso) return;

  clearTimeout(state.timer);
  if (state.frame) cancelAnimationFrame(state.frame);
  const previous = state.iso;
  state.iso = iso;
  selections.set(map, state);

  const show = (code: string) => {
    safely(() => {
      setFilters(map, code);
      setFade(map, 1000, 350);
      map.setPaintProperty(LAYERS.selectedGlow, 'line-width', 10);
    });
    // Next frame: the filter is applied at opacity 0 first, so the fade starts from nothing.
    state.frame = requestAnimationFrame(() =>
      safely(() => {
        setVisible(map, true);
        state.timer = setTimeout(() => pulseGlow(map, state), 1100);
      }),
    );
  };

  if (!iso) {
    safely(() => {
      setFade(map, 600);
      setVisible(map, false);
    });
    state.timer = setTimeout(() => safely(() => setFilters(map, null)), 650);
    return;
  }

  if (!previous) {
    show(iso);
    return;
  }

  // From one country to another: the old one fades out first, then the new one fades in.
  safely(() => {
    setFade(map, 220);
    setVisible(map, false);
  });
  state.timer = setTimeout(() => show(iso), 240);
};

/** Stops any running fade or pulse. Call before the map is removed. */
export const disposeCountryLayers = (map: mapboxgl.Map): void => {
  const state = selections.get(map);
  if (!state) return;
  clearTimeout(state.timer);
  if (state.frame) cancelAnimationFrame(state.frame);
  selections.delete(map);
};
