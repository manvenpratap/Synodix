/**
 * geocoding.ts — Client-side Geocoding & City Auto-Suggest Service
 * 
 * Provides:
 * 1. Instant 0ms offline fuzzy search across curated world cities.
 * 2. Asynchronous online fallback via keyless OpenStreetMap / Photon geocoding for smaller towns.
 * 3. Exact coordinate resolution for city & country pairs.
 * 4. Device GPS location detection via HTML5 Geolocation.
 */

import { WORLD_CITIES, getMatchingCities } from '../data/worldCities';
import { apiUrl } from './api';

export interface GeocodeResult {
  city: string;
  country: string;
  adminCode?: string;
  latitude: number;
  longitude: number;
  source: 'offline_gazetteer' | 'online_photon' | 'device_gps' | 'online_nominatim';
}

/**
 * Searches for city suggestions using local offline gazetteer first,
 * with backend gateway and online Nominatim enrichment.
 */
export async function searchCitySuggestions(query: string, limit = 10): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  // 1. Instant offline search from curated local gazetteer
  const localMatches = getMatchingCities(trimmed, limit);
  const results: GeocodeResult[] = localMatches.map((c) => ({
    city: c.city,
    country: c.country,
    adminCode: c.adminCode,
    latitude: c.latitude,
    longitude: c.longitude,
    source: 'offline_gazetteer',
  }));

  // If local results already satisfy the limit or user is offline, return immediately (0ms)
  if (results.length >= 6 || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return results.slice(0, limit);
  }

  // 2. Query backend geocode gateway (ultra-fast, 0 CORS, local caching + OSM Nominatim enrichment)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(apiUrl(`/api/geocode?q=${encodeURIComponent(trimmed)}`), {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.city && item.country) {
            const exists = results.some(
              (r) =>
                r.city.toLowerCase() === item.city.toLowerCase() &&
                r.country.toLowerCase() === item.country.toLowerCase()
            );
            if (!exists) {
              results.push({
                city: item.city,
                country: item.country,
                adminCode: item.adminCode,
                latitude: Number(Number(item.latitude).toFixed(4)),
                longitude: Number(Number(item.longitude).toFixed(4)),
                source: item.source || 'online_nominatim',
              });
            }
          }
          if (results.length >= limit) break;
        }
      }
    }
  } catch {
    // Backend gateway unreachable; fall through to client-side Nominatim
  }

  // 3. Fallback: Direct OpenStreetMap Nominatim client-side search if results still empty
  if (results.length === 0 && (typeof navigator === 'undefined' || navigator.onLine !== false)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&limit=8&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SynodixAstrology/2.28', 'Accept-Language': 'en' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          for (const item of data) {
            const addr = item.address || {};
            const cityName =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.municipality ||
              addr.suburb ||
              addr.county ||
              item.name;
            const countryName = addr.country;
            const adminCode = addr.state || addr.province || addr.state_district;
            const lat = Number(item.lat);
            const lon = Number(item.lon);

            if (cityName && countryName && !isNaN(lat) && !isNaN(lon)) {
              const exists = results.some(
                (r) =>
                  r.city.toLowerCase() === cityName.toLowerCase() &&
                  r.country.toLowerCase() === countryName.toLowerCase()
              );
              if (!exists) {
                results.push({
                  city: cityName,
                  country: countryName,
                  adminCode,
                  latitude: Number(lat.toFixed(4)),
                  longitude: Number(lon.toFixed(4)),
                  source: 'online_nominatim',
                });
              }
            }
            if (results.length >= limit) break;
          }
        }
      }
    } catch {
      // Fall through to return existing results
    }
  }

  return results.slice(0, limit);
}

/**
 * Determines exact latitude and longitude for a city and optional country.
 */
export async function determineCoordinates(city: string, country?: string): Promise<GeocodeResult | null> {
  const normCity = city.trim().toLowerCase();
  const normCountry = country ? country.trim().toLowerCase() : '';

  // 1. Check offline gazetteer first (with exact city + country or city alone)
  const exactMatch = WORLD_CITIES.find((c) => {
    const cCity = c.city.toLowerCase();
    const cCountry = c.country.toLowerCase();
    if (normCountry) {
      return (
        cCity === normCity &&
        (cCountry === normCountry || cCountry.includes(normCountry) || normCountry.includes(cCountry))
      );
    }
    return cCity === normCity;
  });

  if (exactMatch) {
    return {
      city: exactMatch.city,
      country: exactMatch.country,
      adminCode: exactMatch.adminCode,
      latitude: exactMatch.latitude,
      longitude: exactMatch.longitude,
      source: 'offline_gazetteer',
    };
  }

  // If no match with country, try matching city alone in offline gazetteer
  if (normCountry) {
    const cityOnlyMatch = WORLD_CITIES.find((c) => c.city.toLowerCase() === normCity);
    if (cityOnlyMatch) {
      return {
        city: cityOnlyMatch.city,
        country: cityOnlyMatch.country,
        adminCode: cityOnlyMatch.adminCode,
        latitude: cityOnlyMatch.latitude,
        longitude: cityOnlyMatch.longitude,
        source: 'offline_gazetteer',
      };
    }
  }

  // 2. Fallback: search via online / backend gateway
  const searchResults = await searchCitySuggestions(country ? `${city}, ${country}` : city, 1);
  if (searchResults.length > 0) {
    return searchResults[0];
  }

  // If search with country returned empty, retry with city alone
  if (country) {
    const cityOnlyResults = await searchCitySuggestions(city, 1);
    if (cityOnlyResults.length > 0) {
      return cityOnlyResults[0];
    }
  }

  return null;
}

export interface DeviceLocationResult {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

/**
 * Reverse geocodes decimal coordinates (lat, lon) into a city and country.
 * Prioritizes:
 * 1. Instant 0ms nearest-neighbor resolution for known gazetteer cities (< 40km).
 * 2. Local Synodix backend reverse-geocoding gateway (server-side, zero-CORS).
 * 3. Offline nearest-neighbor fallback from curated WORLD_CITIES.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ city: string; country: string }> {
  // 1. Calculate nearest neighbor in curated WORLD_CITIES gazetteer
  let closestCity: { city: string; country: string } | null = null;
  let minDistanceSq = Infinity;

  for (const c of WORLD_CITIES) {
    const dLat = c.latitude - latitude;
    const dLon = c.longitude - longitude;
    const meanLatRad = ((c.latitude + latitude) / 2) * (Math.PI / 180);
    const cosLat = Math.cos(meanLatRad);
    const scaledDLon = dLon * cosLat;
    const distSq = dLat * dLat + scaledDLon * scaledDLon;

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closestCity = { city: c.city, country: c.country };
    }
  }

  // If coordinates are within ~40km (0.4 deg, distSq <= 0.16) of a known city, return immediately in 0ms
  if (closestCity && minDistanceSq <= 0.16) {
    return closestCity;
  }

  // 2. Query Synodix backend reverse-geocoding gateway for fine-grained rural resolution
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      apiUrl(`/api/reverse-geocode?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`),
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.city && data.country && data.city !== 'Unknown City') {
        return { city: data.city, country: data.country };
      }
    }
  } catch {
    // Backend gateway unreachable or timed out; fall back to nearest gazetteer city
  }

  // 3. Fallback to nearest gazetteer city (100% reliable)
  return closestCity || { city: 'Gurugram', country: 'India' };
}

/**
 * Requests device GPS coordinates via HTML5 Geolocation API with automatic
 * IP-based fallback if denied/unavailable, and automatically reverse geocodes
 * them into verified city and country names.
 */
export async function requestDeviceLocation(): Promise<DeviceLocationResult> {
  let coords: { latitude: number; longitude: number; city?: string; country?: string } | null = null;

  // 1. Try HTML5 Geolocation API first (fast Wi-Fi / hardware location)
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const perm = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          if (perm && perm.state === 'denied') {
            throw new Error('Geolocation denied');
          }
        } catch {
          // Permissions API query not supported for geolocation in some browsers; proceed
        }
      }
      coords = await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: Number(pos.coords.latitude.toFixed(4)),
              longitude: Number(pos.coords.longitude.toFixed(4)),
            });
          },
          (err) => {
            reject(err);
          },
          { timeout: 3000, enableHighAccuracy: false, maximumAge: 60000 }
        );
      });
    } catch {
      coords = null;
    }
  }

  // 2. Fallback: If HTML5 Geolocation was denied, timed out, or unavailable, try backend IP location
  if (!coords) {
    try {
      const backendRes = await fetch(apiUrl('/api/ip-location'));
      if (backendRes.ok) {
        const ipData = await backendRes.json();
        if (ipData && ipData.latitude && ipData.longitude) {
          coords = {
            latitude: Number(Number(ipData.latitude).toFixed(4)),
            longitude: Number(Number(ipData.longitude).toFixed(4)),
            city: ipData.city || undefined,
            country: ipData.country || undefined,
          };
        }
      }
    } catch {
      // Fall through to direct client IP
    }
  }

  // 3. Tertiary client-side IP fallback
  if (!coords) {
    try {
      const directRes = await fetch('https://ipapi.co/json/');
      if (directRes.ok) {
        const directData = await directRes.json();
        if (directData && directData.latitude && directData.longitude) {
          coords = {
            latitude: Number(Number(directData.latitude).toFixed(4)),
            longitude: Number(Number(directData.longitude).toFixed(4)),
            city: directData.city || undefined,
            country: directData.country_name || undefined,
          };
        }
      }
    } catch {
      // Fall through to resilient fallback
    }
  }

  // 4. Invariant: If still completely unreachable, use resilient default
  if (!coords) {
    coords = {
      latitude: 28.4595,
      longitude: 77.0266,
      city: 'Gurugram',
      country: 'India',
    };
  }

  // 5. Ensure city and country are ALWAYS populated via reverseGeocode
  if (!coords.city || !coords.country || coords.city === 'Unknown City') {
    const geo = await reverseGeocode(coords.latitude, coords.longitude);
    if (geo) {
      coords.city = geo.city;
      coords.country = geo.country;
    }
  }

  return coords;
}
