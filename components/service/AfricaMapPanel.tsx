/* eslint-disable react-hooks/immutability, react-hooks/preserve-manual-memoization */
"use client";

import React, { useEffect, useCallback } from "react";
import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import { AFRICA_MAP_CONFIG } from "@/lib/constants/africa-map";
import { useMapInitializer } from "./MapInitializer";
import { useUserLocationMarker } from "./UserLocationMarker";
import { fetchAfricanGeoJSON } from "@/lib/utils/geojson";
import {
  updateGeoJSONSource,
  addRegionLayers,
  updateSearchHighlight,
} from "@/lib/utils/map-layers";
import { getBoundsFromFeature } from "@/lib/utils/map-bounds";
import { cn } from "@/lib/utils";

export interface AfricaMapPanelProps {
  selectedCountry?: string;
  onCountrySelect?: (countryCode: string) => void;
  userLocation?: { lat: number; lng: number } | null;
  showOnlyUserLocation?: boolean;
  className?: string;
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
}

/**
 * Africa map panel component
 * Displays interactive map with region-based country coloring
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
  const geoJsonDataRef = React.useRef<FeatureCollection | null>(null);
  const onCountrySelectRef = React.useRef(onCountrySelect);
  const setupClickHandlersRef = React.useRef<(() => void) | null>(null);
  const [isGeoJsonLoaded, setIsGeoJsonLoaded] = React.useState(false);

  // Every setTimeout scheduled below is tracked here so it can be cancelled on
  // unmount - without this, a timer can fire after MapInitializer has already
  // called map.current.remove(), and touch a destroyed mapboxgl.Map instance.
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

  // Keep refs updated
  React.useEffect(() => {
    onCountrySelectRef.current = onCountrySelect;
  }, [onCountrySelect]);

  const selectedCountryRef = React.useRef(selectedCountry);
  React.useEffect(() => {
    selectedCountryRef.current = selectedCountry;
  }, [selectedCountry]);

  // Initialize user location marker
  useUserLocationMarker({
    map: map.current,
    userLocation,
    show: showOnlyUserLocation,
  });

  interface CustomMap extends mapboxgl.Map {
    _africaClickHandler?: (e: mapboxgl.MapMouseEvent) => void;
    _africaMouseEnterHandler?: () => void;
    _africaMouseLeaveHandler?: () => void;
  }

  // Setup click handler for country selection
  const setupClickHandlers = useCallback(() => {
    // Check if layer exists
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (!map.current) return;

      console.log("[AfricaMap] Click event triggered at:", e.lngLat);
      // Query features at click point
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ["africa-countries-fill", "africa-countries-outline"],
      });

      console.log("[AfricaMap] Queried features at click point:", features.length);

      if (features.length > 0) {
        const fillFeature = features.find(
          (f) => f.layer?.id === "africa-countries-fill",
        );
        const clickedFeature = fillFeature || features[0];
        const countryName = clickedFeature.properties?.name as string;

        console.log("[AfricaMap] Clicked country feature name:", countryName);

        if (countryName && onCountrySelectRef.current) {
          const currentSelected = selectedCountryRef.current?.trim() || "";
          if (countryName.toLowerCase() === currentSelected.toLowerCase()) {
            console.log("[AfricaMap] Toggling country deselection:", countryName);
            onCountrySelectRef.current("");
          } else {
            console.log("[AfricaMap] Selecting country:", countryName);
            onCountrySelectRef.current(countryName);
          }
        }
      } else {
        console.log("[AfricaMap] Clicked on empty space (clearing country selection).");
        if (onCountrySelectRef.current) {
          onCountrySelectRef.current("");
        }
      }
    };

    if (!map.current) return;
    const customMap = map.current as unknown as CustomMap;
    const existingHandler = customMap._africaClickHandler;
    if (existingHandler) {
      customMap.off("click", existingHandler);
    }

    // Store handler reference for cleanup
    customMap._africaClickHandler = handleMapClick;
    customMap.on("click", handleMapClick);

    // Change cursor on hover
    const handleMouseEnter = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = "pointer";
      }
    };

    const handleMouseLeave = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = "";
      }
    };

    // Remove existing hover handlers
    // Add hover handlers
    if (map.current && map.current.getLayer("africa-countries-fill")) {
      map.current.on("mouseenter", "africa-countries-fill", handleMouseEnter);
      map.current.on("mouseleave", "africa-countries-fill", handleMouseLeave);

      // Store hover handlers for cleanup if needed
      customMap._africaMouseEnterHandler = handleMouseEnter;
      customMap._africaMouseLeaveHandler = handleMouseLeave;
    }
  }, [map]);

  // Update setupClickHandlers ref
  React.useEffect(() => {
    setupClickHandlersRef.current = setupClickHandlers;
  }, [setupClickHandlers]);

  // Load and process GeoJSON data
  const loadGeoJSONData = useCallback(async () => {
    if (!map.current || !isLoaded) return;

    console.log("[AfricaMap] Starting GeoJSON load...");
    const geoJson = await fetchAfricanGeoJSON();
    if (!geoJson) {
      console.error("[AfricaMap] Failed to load GeoJSON!");
      return;
    }

    console.log("[AfricaMap] GeoJSON loaded successfully. Features count:", geoJson.features.length);
    geoJsonDataRef.current = geoJson;
    updateGeoJSONSource(map.current, geoJson);
    setIsGeoJsonLoaded(true);

    // Add layers after source is ready
    scheduleTimeout(() => {
      if (map.current && map.current.getSource("africa-countries")) {
        console.log("[AfricaMap] Adding region layers to map...");
        addRegionLayers(map.current);

        // Setup click handlers after layers are added
        scheduleTimeout(() => {
          if (onCountrySelectRef.current && map.current) {
            console.log("[AfricaMap] Setting up click/hover handlers...");
            setupClickHandlers();
          }
        }, 200);
      }
    }, 100);
  }, [map, isLoaded, setupClickHandlers, scheduleTimeout]);

  // Load GeoJSON when map is ready
  useEffect(() => {
    if (isLoaded) {
      loadGeoJSONData();
    }
  }, [isLoaded, loadGeoJSONData]);

  // Setup click handlers when map is loaded and onCountrySelect is available
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !isLoaded || !onCountrySelectRef.current) {
      return;
    }

    // Wait for layers to be added, then setup handlers
    let retryCount = 0;
    const maxRetries = 30; // Try for up to 6 seconds (200ms * 30)

    const checkAndSetup = () => {
      if (!currentMap) return;

      if (currentMap.getLayer("africa-countries-fill")) {
        setupClickHandlers();
      } else if (retryCount < maxRetries) {
        retryCount++;
        scheduleTimeout(checkAndSetup, 200);
      }
    };

    checkAndSetup();

    // Cleanup event handlers on unmount (pending retry timers are cleared by
    // the dedicated pendingTimeoutsRef effect above)
    return () => {
      if (currentMap) {
        const customMap = currentMap as unknown as CustomMap;
        const existingHandler = customMap._africaClickHandler;
        if (existingHandler) {
          customMap.off("click", existingHandler);
          delete customMap._africaClickHandler;
        }

        const mouseEnterHandler = customMap._africaMouseEnterHandler;
        const mouseLeaveHandler = customMap._africaMouseLeaveHandler;

        if (mouseEnterHandler) {
          customMap.off(
            "mouseenter",
            "africa-countries-fill",
            mouseEnterHandler,
          );
          delete customMap._africaMouseEnterHandler;
        }
        if (mouseLeaveHandler) {
          customMap.off(
            "mouseleave",
            "africa-countries-fill",
            mouseLeaveHandler,
          );
          delete customMap._africaMouseLeaveHandler;
        }
      }
    };
  }, [map, isLoaded, setupClickHandlers, scheduleTimeout]);

  // Update search highlight when selectedCountry changes
  useEffect(() => {
    if (!map.current || !isLoaded || !geoJsonDataRef.current) return;

    console.log("[AfricaMap] selectedCountry changed. Updating highlight for:", selectedCountry);
    const updatedGeoJson = updateSearchHighlight(
      map.current,
      geoJsonDataRef.current,
      selectedCountry?.trim() || null,
    );

    geoJsonDataRef.current = updatedGeoJson;
    updateGeoJSONSource(map.current, updatedGeoJson);

    // Re-setup click handlers after source update (in case layers were affected)
    // Wait a bit longer to ensure layers are fully rendered
    if (onCountrySelectRef.current) {
      scheduleTimeout(() => {
        if (
          map.current &&
          map.current.getLayer("africa-countries-fill") &&
          setupClickHandlersRef.current
        ) {
          setupClickHandlersRef.current();
        }
      }, 200);
    }

    // Animate to searched country
    if (selectedCountry?.trim() && geoJsonDataRef.current) {
      const searchedFeature = geoJsonDataRef.current.features.find(
        (f) =>
          (f.properties?.name as string)?.toLowerCase() ===
          selectedCountry.toLowerCase(),
      );

      if (searchedFeature) {
        const bounds = getBoundsFromFeature(searchedFeature);
        console.log("[AfricaMap] Zooming map to bounds of country:", selectedCountry, bounds);
        if (bounds && map.current) {
          map.current.fitBounds(bounds, {
            padding: padding || 50,
            duration: AFRICA_MAP_CONFIG.animation.duration,
            easing: (t: number) => t * (2 - t),
          });
        }
      } else {
        console.warn("[AfricaMap] Country not found in GeoJSON features:", selectedCountry);
      }
    } else if (!selectedCountry?.trim()) {
      console.log("[AfricaMap] Search cleared. Resetting map view to default Africa bounds.");
      map.current.fitBounds(AFRICA_MAP_CONFIG.bounds.africa, {
        padding: padding || 10, // Use prop padding or default
        duration: 1000,
        easing: (t: number) => t * (2 - t),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, isLoaded, map, padding, isGeoJsonLoaded]);

  // Reset map view when showOnlyUserLocation changes
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
      <div className={cn("relative w-full h-full bg-[#181818] overflow-hidden flex flex-col md:flex-row items-stretch", className)}>
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-brand-green blur-[80px]" />
          <div className="absolute bottom-[10%] right-[40%] w-[250px] h-[250px] rounded-full bg-brand-green blur-[100px]" />
        </div>

        {/* Fallback Content - Positioned to the right of the overlays on desktop */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center md:pl-[680px] p-6 text-center text-white">
          <div className="max-w-md mx-auto flex flex-col items-center">
            {/* Elegant Map Icon */}
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-6 shadow-lg animate-pulse">
              <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-8.25V15m-9 3.75h.008v.008H6v-.008zm.008 0H6V18h.008v-.008zm0 0H6v-.008H5.992v.008zm0 0h.008V18H6v-.008zm0 0H6v.008h-.008V18zm0 0H6V18h.008v-.008zm0 0H6V18h.008v-.008zm0 0h-.008v-.008H5.992v.008zm0 0h.008v.008H6v-.008zM15 18h.008v.008H15V18zm.008 0H15V18h.008v-.008zm0 0H15v-.008h-.008v.008zm0 0h.008V18H15v-.008zm0 0H15v.008h-.008V18zm0 0H15V18h.008v-.008zm0 0H15V18h.008v-.008zm0 0h-.008v-.008h-.008v.008zm0 0h.008v.008H15V18zm-6 0h.008v.008H9V18zm.008 0H9V18h.008v-.008zm0 0H9v-.008H8.992v.008zm0 0h.008V18H9v-.008zm0 0H9v.008h-.008V18zm0 0H9V18h.008v-.008zm0 0H9V18h.008v-.008zm0 0h-.008v-.008H8.992v.008zm0 0h.008v.008H9v-.008zM12 3.75v.008H12V3.75zm.008 0H12V3.75h.008v-.008zm0 0H12v-.008h-.008v.008zm0 0h.008V3.75H12v-.008zm0 0H12v.008h-.008V3.75zm0 0H12V3.75h.008v-.008zm0 0H12V3.75h.008v-.008zm0 0h-.008v-.008h-.008v.008zm0 0h.008v.008H12v-.008zM12 20.25V21m0-17.25v.008H12V3.75zm0 0v16.5m0-16.5H9.75M12 3.75h2.25m-2.25 16.5H9.75m2.25 0h2.25m-2.25-16.5v16.5m0-16.5L9.75 6.75m2.25-3L14.25 6.75M12 20.25l-2.25-3.75m2.25 3.75l2.25-3.75M9.75 6.75V16.5M14.25 6.75V16.5M9.75 6.75L6 9.75m8.25-3l3.75 3m-12 0v7.5m8.25-7.5v7.5m-8.25 0l-3.75 3.75m12-3.75l3.75 3.75M2.25 13.5h19.5" />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2 tracking-tight text-white">
              服务地图已切换为简化版
            </h3>
            
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {error?.includes("not set") ? (
                <>
                  因未检测到 <code className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-brand-green font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> 环境变量，系统已自动加载备用交互界面。
                </>
              ) : (
                <>
                  <code className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-brand-green font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> 无效或格式不正确，系统已自动加载备用交互界面。
                </>
              )}
            </p>

            {/* Quick Country Selector Fallback */}
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6 shadow-inner">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                选择 Apsonic 覆盖国家
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Ghana (加纳)", code: "Ghana", flag: "🇬🇭" },
                  { name: "Togo (多哥)", code: "Togo", flag: "🇹🇬" },
                  { name: "Benin (贝宁)", code: "Benin", flag: "🇧🇯" },
                  { name: "Mali (马里)", code: "Mali", flag: "🇲🇱" },
                ].map((country) => {
                  const isSelected = selectedCountry?.toLowerCase() === country.code.toLowerCase();
                  return (
                    <button
                      key={country.code}
                      onClick={() => {
                        if (onCountrySelect) {
                          if (isSelected) {
                            onCountrySelect("");
                          } else {
                            onCountrySelect(country.code);
                          }
                        }
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200",
                        isSelected
                          ? "bg-red-600 border-transparent text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] scale-[1.02]"
                          : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <span>{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-gray-500 leading-normal">
              提示：若要启用包含缩放、定位及精确路线规划的完整 3D 渲染地图，请在 <code className="text-gray-400">.env.local</code> 中配置您的 Mapbox 公钥并重启服务。
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={cn("w-full h-full overflow-hidden", className)}
    />
  );
};

