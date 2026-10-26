import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker with aggressive cache invalidation & update checks
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Purge any legacy stale caches
    if (typeof caches !== 'undefined') {
      caches.keys().then((keys) => {
        for (const key of keys) {
          if (key !== 'synodix-v2.31.4') {
            caches.delete(key);
          }
        }
      });
    }

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Force update check on every load
      reg.update();
    }).catch((err) => {
      console.warn('ServiceWorker registration failed: ', err)
    })
  })
}
