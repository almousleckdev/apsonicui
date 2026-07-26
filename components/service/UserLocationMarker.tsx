'use client';

/**
 * User location marker component
 * Manages user location marker on the map
 */

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface UserLocationMarkerProps {
  map: mapboxgl.Map | null;
  userLocation: { lat: number; lng: number } | null | undefined;
  show: boolean;
}

export const useUserLocationMarker = ({
  map,
  userLocation,
  show,
}: UserLocationMarkerProps): void => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !show || !userLocation) {
      // Remove marker if conditions not met
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create custom marker element
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#2196F3';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.style.cursor = 'pointer';

    // Create marker
    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, userLocation, show]);
};

