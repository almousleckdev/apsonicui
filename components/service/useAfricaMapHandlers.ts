'use client';

import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface CustomMap extends mapboxgl.Map {
  _africaClickHandler?: (e: mapboxgl.MapMouseEvent) => void;
  _africaMouseEnterHandler?: () => void;
  _africaMouseLeaveHandler?: () => void;
}

export function useAfricaMapHandlers(
  mapRef: React.RefObject<mapboxgl.Map | null>,
  selectedCountryRef: React.RefObject<string | undefined>,
  onCountrySelectRef: React.RefObject<((country: string) => void) | undefined>
) {
  const setupClickHandlers = useCallback(() => {
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (!mapRef.current) return;

      const features = mapRef.current.queryRenderedFeatures(e.point, {
        layers: ['africa-countries-fill', 'africa-countries-outline'],
      });

      if (features.length > 0) {
        const fillFeature = features.find((f) => f.layer?.id === 'africa-countries-fill');
        const clickedFeature = fillFeature || features[0];
        const countryName = clickedFeature.properties?.name as string;

        if (countryName && onCountrySelectRef.current) {
          const currentSelected = selectedCountryRef.current?.trim() || '';
          if (countryName.toLowerCase() === currentSelected.toLowerCase()) {
            onCountrySelectRef.current('');
          } else {
            onCountrySelectRef.current(countryName);
          }
        }
      } else {
        if (onCountrySelectRef.current) {
          onCountrySelectRef.current('');
        }
      }
    };

    if (!mapRef.current) return;
    const customMap = mapRef.current as unknown as CustomMap;
    const existingHandler = customMap._africaClickHandler;
    if (existingHandler) {
      customMap.off('click', existingHandler);
    }

    customMap._africaClickHandler = handleMapClick;
    customMap.on('click', handleMapClick);

    const handleMouseEnter = () => {
      if (mapRef.current) mapRef.current.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      if (mapRef.current) mapRef.current.getCanvas().style.cursor = '';
    };

    if (mapRef.current && mapRef.current.getLayer('africa-countries-fill')) {
      mapRef.current.on('mouseenter', 'africa-countries-fill', handleMouseEnter);
      mapRef.current.on('mouseleave', 'africa-countries-fill', handleMouseLeave);
      customMap._africaMouseEnterHandler = handleMouseEnter;
      customMap._africaMouseLeaveHandler = handleMouseLeave;
    }
  }, [mapRef, selectedCountryRef, onCountrySelectRef]);

  return setupClickHandlers;
}
