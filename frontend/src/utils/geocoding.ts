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
  source: 'offline_gazetteer' | 'online_photon' | 'device_gps';
}

/**
 * Searches for city suggestions using local offline gazetteer first,
 * with optional online enrichment if connected.
 */
export async function searchCitySuggestions(query: string, limit = 8): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  // 1. Instant offline search
  const localMatches = getMatchingCities(trimmed, limit);
  const results: GeocodeResult[] = localMatches.map((c) => ({
    city: c.city,
    country: c.country,
    adminCode: c.adminCode,
    latitude: c.latitude,
    longitude: c.longitude,
    source: 'offline_gazetteer',
  }));

  // If local results are found or user is offline, return immediately for instant 0ms response
  if (results.length > 0 || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return results;
  }

  // 2. Online enrichment fallback via Photon (Komoot / OpenStreetMap)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=6`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.features && Array.isArray(data.features)) {
        for (const feat of data.features) {
          const props = feat.properties || {};
          const coords = feat.geometry?.coordinates;
          const cityName = props.name || props.city || props.town || props.village;
          const countryName = props.country;

          if (cityName && countryName && Array.isArray(coords) && coords.length >= 2) {
            const lon = Number(coords[0]);
            const lat = Number(coords[1]);

            // Deduplicate against local matches
            const exists = results.some(
              (r) => r.city.toLowerCase() === cityName.toLowerCase() &&
                     r.country.toLowerCase() === countryName.toLowerCase()
            );

            if (!exists && !isNaN(lat) && !isNaN(lon)) {
              results.push({
                city: cityName,
                country: countryName,
                adminCode: props.state || props.county,
                latitude: Number(lat.toFixed(4)),
                longitude: Number(lon.toFixed(4)),
                source: 'online_photon',
              });
            }
          }
          if (results.length >= limit) break;
        }
      }
    }
  } catch {
    // Silently fall back to offline results if network fails or times out
  }

  return results.slice(0, limit);
}

/**
 * Determines exact latitude and longitude for a city and optional country.
 */
export async function determineCoordinates(city: string, country?: string): Promise<GeocodeResult | null> {
  const normCity = city.trim().toLowerCase();
  const normCountry = country ? country.trim().toLowerCase() : '';

  // Check offline gazetteer first
  const exactMatch = WORLD_CITIES.find((c) => {
    const cCity = c.city.toLowerCase();
    const cCountry = c.country.toLowerCase();
    if (normCountry) {
      return cCity === normCity && (cCountry === normCountry || cCountry.includes(normCountry) || normCountry.includes(cCountry));
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

  // Fallback: search online
  const searchResults = await searchCitySuggestions(country ? `${city}, ${country}` : city, 1);
  if (searchResults.length > 0) {
    return searchResults[0];
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
 * 1. Local Synodix backend reverse-geocoding gateway (server-side, zero-CORS).
 * 2. Direct OpenStreetMap Nominatim reverse geocoding.
 * 3. Photon OpenStreetMap reverse geocoding.
 * 4. Offline nearest-neighbor fallback from curated WORLD_CITIES.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ city: string; country: string } | null> {
  // 1. Try local Synodix backend reverse-geocoding gateway
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
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
    // Fall through to direct client-side providers
  }

  // 2. Direct OpenStreetMap Nominatim reverse geocoding
  if (typeof navigator === 'undefined' || navigator.onLine !== false) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&format=json`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SynodixAstrology/2.27', 'Accept-Language': 'en' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.suburb ||
          addr.city_district ||
          addr.county ||
          addr.state_district;
        const country = addr.country;
        if (city && country) {
          return { city, country };
        }
      }
    } catch {
      // Fall through to Photon
    }

    // 3. Photon reverse geocoding fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const url = `https://photon.komoot.io/reverse?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const feat = data.features?.[0];
        const props = feat?.properties;
        if (props) {
          const city =
            props.city ||
            props.town ||
            props.village ||
            props.municipality ||
            props.locality ||
            props.district ||
            props.county ||
            props.name;
          const country = props.country;
          if (city && country) {
            return { city, country };
          }
        }
      }
    } catch {
      // Fall through to offline nearest-neighbor match
    }
  }

  // 4. Offline nearest neighbor in curated WORLD_CITIES gazetteer
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

  return closestCity;
}

/**
 * Requests device GPS coordinates via HTML5 Geolocation API with automatic
 * IP-based fallback if denied/unavailable, and automatically reverse geocodes
 * them into verified city and country names.
 */
export async function requestDeviceLocation(): Promise<DeviceLocationResult> {
  let coords: { latitude: number; longitude: number; city?: string; country?: string } | null = null;

  // 1. Try HTML5 Geolocation API first
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
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
          { timeout: 7000, enableHighAccuracy: true, maximumAge: 60000 }
        );
      });
    } catch {
      coords = null;
    }
  }

  // 2. Fallback: If HTML5 Geolocation was denied, timed out, or unavailable, try IP location
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
      // Direct client-side ip-api fallback
      try {
        const directRes = await fetch('http://ip-api.com/json/');
        if (directRes.ok) {
          const directData = await directRes.json();
          if (directData && directData.status === 'success') {
            coords = {
              latitude: Number(Number(directData.lat).toFixed(4)),
              longitude: Number(Number(directData.lon).toFixed(4)),
              city: directData.city || undefined,
              country: directData.country || undefined,
            };
          }
        }
      } catch {
        // Fall through
      }
    }
  }

  if (!coords) {
    throw new Error('Unable to detect location. Please check connection or enter coordinates manually.');
  }

  // 3. If city and country are not yet resolved, reverse geocode now
  if (!coords.city || !coords.country) {
    try {
      const geo = await reverseGeocode(coords.latitude, coords.longitude);
      if (geo) {
        return {
          ...coords,
          city: geo.city,
          country: geo.country,
        };
      }
    } catch {
      // Return coords as-is if reverse geocode fails
    }
  }

  return coords;
}
