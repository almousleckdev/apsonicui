// Service Support business logic hook
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { STORES, filterStores } from '@/lib/data/stores';
import type { Store, StoreFilter } from '@/lib/types/store';
import type { StoreQueryType } from '@/components/service/StoreQueryPanel';
import { getUserLocation, calculateDistance, reverseGeocode, type Coordinates, type Address } from '@/lib/utils/geolocation';
import { findApsonicCountry } from '@/lib/data/apsonic-countries';

export const useServiceSupport = () => {
  const [queryType, setQueryType] = useState<StoreQueryType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [userAddress, setUserAddress] = useState<Address | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Guards against a stale response overwriting a newer one if the user
  // toggles the query type again before the previous lookup has settled.
  const latestLocationRequestIdRef = useRef(0);

  const fetchUserLocation = useCallback(() => {
    const requestId = ++latestLocationRequestIdRef.current;
    const isStale = () => latestLocationRequestIdRef.current !== requestId;

    setIsLoadingLocation(true);
    setLocationError(null);
    setUserAddress(null);

    getUserLocation()
      .then(async (location) => {
        if (isStale()) return;
        setUserLocation(location);
        try {
          const address = await reverseGeocode(location);
          if (!isStale()) setUserAddress(address);
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        }
        if (!isStale()) setIsLoadingLocation(false);
      })
      .catch((error) => {
        if (isStale()) return;
        console.error('Error getting user location:', error);
        setLocationError(error.message || 'Unable to get your location');
        setIsLoadingLocation(false);
      });
  }, []);

  // Triggered by the action that changes the query type
  const handleSetQueryType = (type: StoreQueryType | null | ((prev: StoreQueryType | null) => StoreQueryType | null)) => {
    const nextType = typeof type === 'function' ? type(queryType) : type;

    if (nextType === 'nearby' && queryType !== 'nearby') {
      fetchUserLocation();
    }
    if (nextType !== 'nearby') {
      latestLocationRequestIdRef.current += 1; // invalidate any in-flight lookup
      setUserLocation(null);
      setUserAddress(null);
      setLocationError(null);
      setIsLoadingLocation(false);
    }

    setQueryType(nextType);
  };

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    const filter: StoreFilter = {
      type: queryType === 'pickup' ? 'dealer' : 'all',
      search: searchTerm,
      country: selectedCountry || undefined,
    };
    
    let stores = filterStores(STORES, filter);

    if (queryType === 'nearby' && userLocation) {
      stores = stores
        .map((store) => ({
          ...store,
          distance: calculateDistance(userLocation, store.coordinates),
        }))
        .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

      const closestStore = stores[0];
      if (closestStore && closestStore.distance && closestStore.distance > 100) {
        stores = [closestStore];
      }
    }

    return stores;
  }, [queryType, searchTerm, selectedCountry, userLocation]);

  // How long the typing must pause before the map reacts, so it does not fly after every key press.
  const TYPING_PAUSE_MS = 450;
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(typingTimerRef.current), []);

  // Handle explicit selection of country (from map click, dropdown option, etc.): immediate.
  const handleCountrySelect = (countryName: string) => {
    clearTimeout(typingTimerRef.current);
    setSelectedCountry(countryName || '');
    setSearchTerm(countryName || '');
    setSelectedStore(undefined);
  };

  // Handle search text entry: the list filters at once, the map reacts when the typing pauses.
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSelectedStore(undefined);
    clearTimeout(typingTimerRef.current);

    const query = value.trim().toLowerCase();
    if (!query) {
      setSelectedCountry('');
      return;
    }

    // "Gabon", "Côte d'Ivoire", "加蓬"... or a partial name that points to one country only.
    let country = findApsonicCountry(value)?.name ?? '';

    // Otherwise a store detail (a city, a shop name) leads to its country.
    if (!country) {
      const store = STORES.find(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query) ||
          (s.city && s.city.toLowerCase().includes(query)) ||
          s.country.toLowerCase().includes(query),
      );
      country = store?.country ?? '';
    }

    typingTimerRef.current = setTimeout(() => setSelectedCountry(country), TYPING_PAUSE_MS);
  };

  return {
    queryType,
    setQueryType: handleSetQueryType,
    searchTerm,
    selectedStore,
    setSelectedStore,
    selectedCountry,
    userLocation,
    userAddress,
    isLoadingLocation,
    locationError,
    filteredStores,
    handleSearchChange,
    handleCountrySelect,
  };
};
