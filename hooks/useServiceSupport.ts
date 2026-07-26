// Service Support business logic hook
import { useState, useMemo, useCallback, useRef } from 'react';
import { STORES, filterStores } from '@/lib/data/stores';
import type { Store, StoreFilter } from '@/lib/types/store';
import type { StoreQueryType } from '@/components/service/StoreQueryPanel';
import { getUserLocation, calculateDistance, reverseGeocode, type Coordinates, type Address } from '@/lib/utils/geolocation';
import { findCountryFromSearch } from '@/lib/utils/country-search';

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

  // Handle explicit selection of country (from map click, dropdown option, etc.)
  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName || '');
    if (countryName) {
      setSearchTerm(countryName);
    } else {
      setSearchTerm('');
    }
    setSelectedStore(undefined);
  };

  // Handle search text entry (updates searchTerm without locking type/delete)
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    const normalizedVal = value.trim().toLowerCase();
    if (!normalizedVal) {
      setSelectedCountry('');
      setSelectedStore(undefined);
      return;
    }
    
    // Comprehensive dictionary mapping localized search entries to canonical country names
    const mapping: Record<string, string> = {
      // Ghana
      ghana: 'Ghana',
      加纳: 'Ghana',
      // Togo
      togo: 'Togo',
      多哥: 'Togo',
      // Benin
      benin: 'Benin',
      bénin: 'Benin',
      贝宁: 'Benin',
      // Mali
      mali: 'Mali',
      马里: 'Mali',
      // Guinea
      guinea: 'Guinea',
      guinée: 'Guinea',
      几内亚: 'Guinea',
      // Burkina Faso
      'burkina faso': 'Burkina Faso',
      burkina: 'Burkina Faso',
      布基纳法索: 'Burkina Faso',
      // Ivory Coast
      'ivory coast': 'Ivory Coast',
      "côte d'ivoire": 'Ivory Coast',
      "cote d'ivoire": 'Ivory Coast',
      科特迪瓦: 'Ivory Coast',
      // Tanzania
      tanzania: 'Tanzania',
      tanzanie: 'Tanzania',
      坦桑尼亚: 'Tanzania',
      // Kenya
      kenya: 'Kenya',
      肯尼亚: 'Kenya',
      // Uganda
      uganda: 'Uganda',
      ouganda: 'Uganda',
      乌干达: 'Uganda',
      // Cameroon
      cameroon: 'Cameroon',
      cameroun: 'Cameroon',
      // Central African Republic
      'central african republic': 'Central African Republic',
      car: 'Central African Republic',
      'république centrafricaine': 'Central African Republic',
      中非: 'Central African Republic',
      中非共和国: 'Central African Republic',
      // Congo
      congo: 'Congo',
      刚果: 'Congo',
      刚果共和国: 'Congo',
      // Democratic Republic of Congo
      'democratic republic of congo': 'Democratic Republic of Congo',
      'dr congo': 'Democratic Republic of Congo',
      drc: 'Democratic Republic of Congo',
      'rd congo': 'Democratic Republic of Congo',
      'république démocratique du congo': 'Democratic Republic of Congo',
      民主刚果: 'Democratic Republic of Congo',
      刚果金: 'Democratic Republic of Congo',
      '刚果(金)': 'Democratic Republic of Congo',
    };

    const isChinese = /[\u4e00-\u9fa5]/.test(normalizedVal);
    const minLength = isChinese ? 1 : 2;

    const matchedCountryKey = Object.keys(mapping).find(
      key => key === normalizedVal || (key.includes(normalizedVal) && normalizedVal.length >= minLength)
    );

    if (matchedCountryKey) {
      const canonicalCountry = mapping[matchedCountryKey];
      setSelectedCountry(canonicalCountry);
    } else {
      // Fallback: Check if user searched for a store attribute (e.g. Accra, Bamako) and select its country
      const matchingStores = STORES.filter(store => 
        store.name.toLowerCase().includes(normalizedVal) ||
        store.address.toLowerCase().includes(normalizedVal) ||
        (store.city && store.city.toLowerCase().includes(normalizedVal)) ||
        store.country.toLowerCase().includes(normalizedVal)
      );

      if (matchingStores.length > 0) {
        const countries = Array.from(new Set(matchingStores.map(s => s.country)));
        setSelectedCountry(countries[0]);
      } else {
        setSelectedCountry('');
      }
    }
    
    setSelectedStore(undefined);
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
