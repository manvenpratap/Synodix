import { Capacitor } from '@capacitor/core';

const STORAGE_KEY = 'synodix_api_server_url';
export const DEFAULT_DEV_API_URL = 'http://192.168.1.11:8000';

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null && stored.trim() !== '') {
    return stored.trim().replace(/\/+$/, '');
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return (import.meta.env.VITE_API_BASE_URL as string).replace(/\/+$/, '');
  }

  // When running natively on iOS or Android, relative URLs fail because assets are served locally
  if (Capacitor.isNativePlatform()) {
    return DEFAULT_DEV_API_URL;
  }

  return '';
}

export function setApiBaseUrl(url: string): void {
  if (!url || !url.trim()) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, url.trim().replace(/\/+$/, ''));
  }
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
}
