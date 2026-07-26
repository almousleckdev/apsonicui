/**
 * Geolocation and distance calculation utilities
 * Handles user location, reverse geocoding, and distance calculations
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Get user's current location using browser Geolocation API
 */
export const getUserLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm}km`;
};

export interface Address {
  country: string;
  city: string;
  address: string;
  fullAddress: string;
}

/**
 * Reverse geocode coordinates to get address using OpenStreetMap Nominatim (free)
 */
export const reverseGeocode = async (coordinates: Coordinates): Promise<Address> => {
  try {
    const { lat, lng } = coordinates;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Apsonic Website', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }

    const data = await response.json();
    const address = data.address || {};
    
    // Extract address components
    const country = address.country || address.country_code?.toUpperCase() || 'Unknown';
    const city = address.city || 
                 address.town || 
                 address.village || 
                 address.municipality || 
                 address.county || 
                 'Unknown';
    const street = address.road || address.street || '';
    const houseNumber = address.house_number || '';
    const postalCode = address.postcode || '';
    
    // Build full address
    const addressParts = [];
    if (houseNumber) addressParts.push(houseNumber);
    if (street) addressParts.push(street);
    if (city && city !== 'Unknown') addressParts.push(city);
    if (postalCode) addressParts.push(postalCode);
    if (country && country !== 'Unknown') addressParts.push(country);
    
    const fullAddress = addressParts.length > 0 
      ? addressParts.join(', ')
      : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    return {
      country,
      city,
      address: street ? `${houseNumber ? houseNumber + ' ' : ''}${street}`.trim() : fullAddress,
      fullAddress,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Fallback to coordinates
    return {
      country: 'Unknown',
      city: 'Unknown',
      address: `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
      fullAddress: `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
    };
  }
};

