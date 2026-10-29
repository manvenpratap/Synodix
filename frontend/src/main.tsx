import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { APP_VERSION_LABEL } from './version'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service Worker & Cache Management
if ('serviceWorker' in navigator) {
  if (Capacitor.isNativePlatform()) {
    // Native Capacitor Mobile (Android & iOS):
    // 1. Unregister any existing service workers to prevent WebView cache hijacking.
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
    // 2. Clear any stale CacheStorage in WebView.
    if (typeof caches !== 'undefined') {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key);
        }
      });
    }
  } else {
    // Web / PWA browser environment:
    window.addEventListener('load', () => {
      const CURRENT_CACHE = `synodix-${APP_VERSION_LABEL}`;
      if (typeof caches !== 'undefined') {
        caches.keys().then((keys) => {
          for (const key of keys) {
            if (key !== CURRENT_CACHE) {
              caches.delete(key);
            }
          }
        });
      }

      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.update();
      }).catch((err) => {
        console.warn('ServiceWorker registration failed: ', err);
      });
    });
  }
}
