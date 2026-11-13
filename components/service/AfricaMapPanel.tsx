'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FeatureCollection } from 'geojson';
import { useMapInitializer } from './MapInitializer';
import { useUserLocationMarker } from './UserLocationMarker';
import { fetchAfricanGeoJSON } from '@/lib/utils/geojson';
import {
  COUNTRY_FILL_LAYER,
  COUNTRY_SOURCE_ID,
  addCountryLayers,
  disposeCountryLayers,
  setSelectedCountry,
  updateGeoJSONSource,
} from '@/lib/utils/map-layers';
import { flyToAfrica, flyToCountry, flyToPoint, type MapPadding } from '@/lib/utils/map-camera';
import { findFeatureContaining } from '@/lib/utils/map-geometry';
import { findApsonicCountry } from '@/lib/data/apsonic-countries';
import { AfricaMapFallback } from './AfricaMapControls';
import { cn } from '@/lib/utils';

export interface AfricaMapPanelProps {
  selectedCountry?: string;
  onCountrySelect?: (countryName: string) => void;
  userLocation?: { lat: number; lng: number } | null;
  showOnlyUserLocation?: boolean;
  className?: string;
  padding?: MapPadding;
}

interface HoverLabel {
  name: string;
  apsonic: boolean;
  x: number;
  y: number;
}

/**
 * The Africa map of the service section.
 *
 * - Countries with APSONIC are green. Hovering one lights it up and names it.
 * - The country the visitor typed, clicked, or is in ("Show Nearby Stores") turns red, and the camera flies to it.
 * - Clearing the search, unchecking "nearby", or clicking the same country again flies back out to all of Africa.
 */
export const AfricaMapPanel: React.FC<AfricaMapPanelProps> = ({
  selectedCountry,
  onCountrySelect,
  userLocation,
  showOnlyUserLocation = false,
  className,
  padding,
}) => {
  const { map, isLoaded, mapContainer, error } = useMapInitializer();
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [hover, setHover] = useState<HoverLabel | null>(null);

  // The latest values, read by map event handlers that are installed only once.
  const selectedCountryRef = useRef(selectedCountry);
  const onCountrySelectRef = useRef(onCountrySelect);
  const paddingRef = useRef(padding);
  useEffect(() => {
    selectedCountryRef.current = selectedCountry;
    onCountrySelectRef.current = onCountrySelect;
    paddingRef.current = padding;
  });

  useUserLocationMarker({ map: map.current, userLocation, show: showOnlyUserLocation });

  // 1. Once the map style is ready: load the country shapes and draw the layers.
  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    fetchAfricanGeoJSON().then((data) => {
      const current = map.current;
      if (cancelled || !data || !current) return;
      updateGeoJSONSource(current, data);
      addCountryLayers(current);
      setGeoJson(data);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, map]);

  // 2. Hover and click on the countries.
  useEffect(() => {
    const current = map.current;
    if (!current || !geoJson) return;
    let hoveredId: string | null = null;
    let frame = 0;

    const clearHover = () => {
      if (hoveredId !== null) current.setFeatureState({ source: COUNTRY_SOURCE_ID, id: hoveredId }, { hover: false });
      hoveredId = null;
      current.getCanvas().style.cursor = '';
      setHover(null);
    };

    const onMove = (e: mapboxgl.MapMouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const feature = current.queryRenderedFeatures(e.point, { layers: [COUNTRY_FILL_LAYER] })[0];
        const id = (feature?.properties?.isoCode as string | undefined) ?? null;
        if (!feature || !id) return clearHover();

        const apsonic = feature.properties?.apsonic === true || feature.properties?.apsonic === 'true';
        if (hoveredId !== id) {
          if (hoveredId !== null) current.setFeatureState({ source: COUNTRY_SOURCE_ID, id: hoveredId }, { hover: false });
          current.setFeatureState({ source: COUNTRY_SOURCE_ID, id }, { hover: true });
          hoveredId = id;
        }
        // Only the countries with APSONIC can be chosen.
        current.getCanvas().style.cursor = apsonic ? 'pointer' : '';
        setHover({ name: String(feature.properties?.name ?? ''), apsonic, x: e.point.x, y: e.point.y });
      });
    };

    const onClick = (e: mapboxgl.MapMouseEvent) => {
      const select = onCountrySelectRef.current;
      if (!select) return;
      const feature = current.queryRenderedFeatures(e.point, { layers: [COUNTRY_FILL_LAYER] })[0];
      if (!feature) return select(''); // the sea or empty land: back to all of Africa
      if (feature.properties?.apsonic !== true && feature.properties?.apsonic !== 'true') return;
      const name = String(feature.properties?.name ?? '');
      const same = name.toLowerCase() === (selectedCountryRef.current ?? '').trim().toLowerCase();
      select(same ? '' : name);
    };

    current.on('mousemove', onMove);
    current.on('mouseout', clearHover);
    current.on('click', onClick);
    return () => {
      cancelAnimationFrame(frame);
      current.off('mousemove', onMove);
      current.off('mouseout', clearHover);
      current.off('click', onClick);
    };
  }, [map, geoJson]);

  // 3. Which country is in focus: the chosen one, or (with "Show Nearby Stores") the one the visitor is standing in.
  const focusIso3 = useMemo(() => {
    const chosen = selectedCountry?.trim() ? findApsonicCountry(selectedCountry)?.iso3 : undefined;
    if (chosen) return chosen;
    if (showOnlyUserLocation && userLocation && geoJson) {
      const inside = findFeatureContaining(geoJson, userLocation.lng, userLocation.lat);
      return (inside?.properties?.isoCode as string | undefined) || undefined;
    }
    return undefined;
  }, [selectedCountry, showOnlyUserLocation, userLocation, geoJson]);

  const firstFrameDone = useRef(false);

  // 4. Colour the country red and fly there, or fly back out to Africa.
  useEffect(() => {
    const current = map.current;
    if (!current || !geoJson) return;

    const feature = focusIso3 ? geoJson.features.find((f) => f.properties?.isoCode === focusIso3) : undefined;
    setSelectedCountry(current, feature ? focusIso3! : null);

    if (feature) {
      flyToCountry(current, feature, paddingRef.current);
    } else if (showOnlyUserLocation && userLocation) {
      // Standing somewhere we have no country shape for: show the place itself.
      flyToPoint(current, userLocation.lng, userLocation.lat, paddingRef.current);
    } else {
      flyToAfrica(current, paddingRef.current, !firstFrameDone.current);
    }
    firstFrameDone.current = true;
  }, [map, geoJson, focusIso3, showOnlyUserLocation, userLocation]);

  useEffect(() => {
    const current = map.current;
    return () => {
      if (current) disposeCountryLayers(current);
    };
  }, [map]);

  if (error) {
    return (
      <AfricaMapFallback
        error={error}
        selectedCountry={selectedCountry}
        onCountrySelect={onCountrySelect}
        className={className}
      />
    );
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {/* Full size on purpose: Mapbox's own CSS makes its container position:relative, which would defeat absolute. */}
      <div ref={mapContainer} className="h-full w-full" />
      {hover && hover.name && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-lg border border-white/10 bg-zinc-950/85 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md"
          style={{ left: hover.x, top: hover.y }}
        >
          {hover.name}
          {hover.apsonic && (
            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-green">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              APSONIC
            </span>
          )}
        </div>
      )}
    </div>
  );
};
