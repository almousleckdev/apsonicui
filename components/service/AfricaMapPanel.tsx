/* eslint-disable react-hooks/immutability, react-hooks/preserve-manual-memoization */
'use client';

import React, { useEffect, useCallback } from 'react';
import type { FeatureCollection } from 'geojson';
import mapboxgl from 'mapbox-gl';
import { AFRICA_MAP_CONFIG } from '@/lib/constants/africa-map';
import { useMapInitializer } from './MapInitializer';
import { useUserLocationMarker } from './UserLocationMarker';
import { fetchAfricanGeoJSON } from '@/lib/utils/geojson';
import {
  updateGeoJSONSource,
  addRegionLayers,
  updateSearchHighlight,
} from '@/lib/utils/map-layers';
import { getBoundsFromFeature } from '@/lib/utils/map-bounds';
import { AfricaMapFallback } from './AfricaMapControls';
import { useAfricaMapHandlers } from './useAfricaMapHandlers';
import { cn } from '@/lib/utils';

export interface AfricaMapPanelProps {
  selectedCountry?: string;
  onCountrySelect?: (countryCode: string) => void;
  userLocation?: { lat: number; lng: number } | null;
  showOnlyUserLocation?: boolean;
  className?: string;
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
}

interface CustomMap extends mapboxgl.Map {
  _africaClickHandler?: (e: mapboxgl.MapMouseEvent) => void;
  _africaMouseEnterHandler?: () => void;
  _africaMouseLeaveHandler?: () => void;
}

export const AfricaMapPanel: React.FC<AfricaMapPanelProps> = ({
  selectedCountry,
  onCountrySelect,
  userLocation,
  showOnlyUserLocation = false,
  className,
  padding,
}) => {
  const { map, isLoaded, mapContainer, error } = useMapInitializer();
  const geoJsonDataRef = React.useRef<FeatureCollection | null>(null);
  const onCountrySelectRef = React.useRef(onCountrySelect);
  const setupClickHandlersRef = React.useRef<(() => void) | null>(null);
  const [isGeoJsonLoaded, setIsGeoJsonLoaded] = React.useState(false);

  const pendingTimeoutsRef = React.useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const scheduleTimeout = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(() => {
      pendingTimeoutsRef.current.delete(id);
      fn();
    }, delay);
    pendingTimeoutsRef.current.add(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      pendingTimeoutsRef.current.forEach((id) => clearTimeout(id));
      pendingTimeoutsRef.current.clear();
    };
  }, []);

  React.useEffect(() => {
    onCountrySelectRef.current = onCountrySelect;
  }, [onCountrySelect]);

  const selectedCountryRef = React.useRef(selectedCountry);
  React.useEffect(() => {
    selectedCountryRef.current = selectedCountry;
  }, [selectedCountry]);

  useUserLocationMarker({
    map: map.current,
    userLocation,
    show: showOnlyUserLocation,
  });

  const setupClickHandlers = useAfricaMapHandlers(map, selectedCountryRef, onCountrySelectRef);

  React.useEffect(() => {
    setupClickHandlersRef.current = setupClickHandlers;
  }, [setupClickHandlers]);

  const loadGeoJSONData = useCallback(async () => {
    if (!map.current || !isLoaded) return;

    const geoJson = await fetchAfricanGeoJSON();
    if (!geoJson) return;

    geoJsonDataRef.current = geoJson;
    updateGeoJSONSource(map.current, geoJson);
    setIsGeoJsonLoaded(true);

    scheduleTimeout(() => {
      if (map.current && map.current.getSource('africa-countries')) {
        addRegionLayers(map.current);

        scheduleTimeout(() => {
          if (onCountrySelectRef.current && map.current) {
            setupClickHandlers();
          }
        }, 200);
      }
    }, 100);
  }, [map, isLoaded, setupClickHandlers, scheduleTimeout]);

  useEffect(() => {
    if (!isLoaded) return;
    let isCancelled = false;

    const initGeoJSON = async () => {
      if (!isCancelled) {
        await loadGeoJSONData();
      }
    };
    initGeoJSON();

    return () => {
      isCancelled = true;
    };
  }, [isLoaded, loadGeoJSONData]);

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !isLoaded || !onCountrySelectRef.current) return;

    let retryCount = 0;
    const maxRetries = 30;

    const checkAndSetup = () => {
      if (!currentMap) return;

      if (currentMap.getLayer('africa-countries-fill')) {
        setupClickHandlers();
      } else if (retryCount < maxRetries) {
        retryCount++;
        scheduleTimeout(checkAndSetup, 200);
      }
    };

    checkAndSetup();

    return () => {
      if (currentMap) {
        const customMap = currentMap as unknown as CustomMap;
        if (customMap._africaClickHandler) {
          customMap.off('click', customMap._africaClickHandler);
          delete customMap._africaClickHandler;
        }
        if (customMap._africaMouseEnterHandler) {
          customMap.off('mouseenter', 'africa-countries-fill', customMap._africaMouseEnterHandler);
          delete customMap._africaMouseEnterHandler;
        }
        if (customMap._africaMouseLeaveHandler) {
          customMap.off('mouseleave', 'africa-countries-fill', customMap._africaMouseLeaveHandler);
          delete customMap._africaMouseLeaveHandler;
        }
      }
    };
  }, [map, isLoaded, setupClickHandlers, scheduleTimeout]);

  useEffect(() => {
    if (!map.current || !isLoaded || !geoJsonDataRef.current) return;

    const updatedGeoJson = updateSearchHighlight(
      map.current,
      geoJsonDataRef.current,
      selectedCountry?.trim() || null
    );

    geoJsonDataRef.current = updatedGeoJson;
    updateGeoJSONSource(map.current, updatedGeoJson);

    if (onCountrySelectRef.current) {
      scheduleTimeout(() => {
        if (
          map.current &&
          map.current.getLayer('africa-countries-fill') &&
          setupClickHandlersRef.current
        ) {
          setupClickHandlersRef.current();
        }
      }, 200);
    }

    if (selectedCountry?.trim() && geoJsonDataRef.current) {
      const searchedFeature = geoJsonDataRef.current.features.find(
        (f) =>
          (f.properties?.name as string)?.toLowerCase() ===
          selectedCountry.toLowerCase()
      );

      if (searchedFeature) {
        const bounds = getBoundsFromFeature(searchedFeature);
        if (bounds && map.current) {
          map.current.fitBounds(bounds, {
            padding: padding || 50,
            duration: AFRICA_MAP_CONFIG.animation.duration,
            easing: (t: number) => t * (2 - t),
          });
        }
      }
    } else if (!selectedCountry?.trim()) {
      map.current.fitBounds(AFRICA_MAP_CONFIG.bounds.africa, {
        padding: padding || 10,
        duration: 1000,
        easing: (t: number) => t * (2 - t),
      });
    }
  }, [selectedCountry, isLoaded, map, padding, isGeoJsonLoaded]);

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    if (!showOnlyUserLocation && map.current) {
      map.current.fitBounds(AFRICA_MAP_CONFIG.bounds.africa, {
        padding: padding || { top: 10, bottom: 10, left: 10, right: 10 },
        duration: 1000,
        easing: (t: number) => t * (2 - t),
      });
    } else if (userLocation) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 10,
        duration: 1500,
      });
    }
  }, [showOnlyUserLocation, userLocation, isLoaded, map, padding]);

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

  return <div ref={mapContainer} className={cn('w-full h-full overflow-hidden', className)} />;
};

