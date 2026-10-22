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

  // If local results are sufficient or user is offline, return immediately
  if (results.length >= 4 || typeof navigator !== 'undefined' && !navigator.onLine) {
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

/**
 * Requests device GPS coordinates via HTML5 Geolocation API.
 */
export function requestDeviceLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser/device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
        });
      },
      (err) => {
        reject(new Error(err.message || 'Unable to retrieve location.'));
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  });
}
