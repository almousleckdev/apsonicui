"use client";

/**
 * Map initialization hook
 * Separates map setup logic from main component
 */

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AFRICA_MAP_CONFIG } from "@/lib/constants/africa-map";
import { SERVICE_CONFIG } from "@/lib/constants/service";

interface UseMapInitializerResult {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  isLoaded: boolean;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  error?: string;
}

// Inlined by Next.js at build time - never changes across renders, so this can
// be derived directly instead of round-tripping through effect + setState.
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const useMapInitializer = (): UseMapInitializerResult => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | undefined>(
    MAPBOX_TOKEN ? undefined : "NEXT_PUBLIC_MAPBOX_TOKEN is not set"
  );

  useEffect(() => {
    if (!mapContainer.current || map.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    let loaded = false;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: SERVICE_CONFIG.map.style,
        bounds: AFRICA_MAP_CONFIG.bounds.africa,
        maxBounds: AFRICA_MAP_CONFIG.maxBounds || AFRICA_MAP_CONFIG.bounds.africa,
        minZoom: AFRICA_MAP_CONFIG.minZoom || 3.0,
        maxZoom: 12,
        fitBoundsOptions: {
          padding: 10,
        },
        dragRotate: false, // Prevent orientation issues
        touchPitch: false,
        pitchWithRotate: false,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

      map.current.on("load", () => {
        loaded = true;
        setIsLoaded(true);
      });

      // A wrong-shaped or invalid token (e.g. a Google Maps key dropped into
      // NEXT_PUBLIC_MAPBOX_TOKEN) fails the style fetch asynchronously - the
      // map never rejects, it just never loads, so without this the panel
      // renders a blank canvas forever instead of the fallback UI below.
      map.current.on("error", (e) => {
        if (loaded) return;
        console.error("Mapbox failed to load:", e.error);
        queueMicrotask(() =>
          setError("Failed to load map - check NEXT_PUBLIC_MAPBOX_TOKEN is a valid Mapbox public token"),
        );
      });
    } catch (e) {
      console.error("Failed to initialize Mapbox:", e);
      // Deferred so the update isn't synchronous within the effect body itself.
      queueMicrotask(() => setError("Failed to initialize Mapbox"));
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return { map, isLoaded, mapContainer, error };
};

