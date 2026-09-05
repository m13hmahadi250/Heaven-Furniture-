/**
 * Heaven Furniture Mart - High-Performance Cache & Offline Service Worker
 * Version: heaven-cache-v1
 * Provides instant 0ms cached asset delivery and background preloading.
 */

const CACHE_NAME = 'heaven-furniture-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json',
];

const PRELOAD_IMAGES = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
];

// Install Event: Precaches core shell assets & critical textures with CORS
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Best-effort precaching of static shell
      cache.addAll(STATIC_ASSETS).catch(() => {});
      return Promise.allSettled(
        PRELOAD_IMAGES.map((url) =>
          fetch(url, { mode: 'cors', credentials: 'omit' })
            .then((res) => {
              if (res && res.status === 200) {
                return cache.put(url, res);
              }
            })
            .catch(() => null)
        )
      );
    })
  );
});

// Activate Event: Clear obsolete cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-first for images & fonts; Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests and API calls
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    return;
  }

  // 1. Google Fonts & Static Images (Unsplash / Local): Cache-First Strategy
  const isImage = request.destination === 'image' || url.hostname.includes('unsplash.com');
  const isFont = request.destination === 'font' || url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com');

  if (isImage || isFont) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // If request requires CORS (e.g. Three.js TextureLoader), NEVER serve an opaque response
        const isCorsRequest = request.mode === 'cors';
        const isCachedOpaque = cachedResponse && cachedResponse.type === 'opaque';

        if (cachedResponse && !(isCorsRequest && isCachedOpaque)) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => {
          if (cachedResponse && !(isCorsRequest && isCachedOpaque)) {
            return cachedResponse;
          }
          return null;
        });
      })
    );
    return;
  }

  // 2. Scripts and Stylesheets: Stale-While-Revalidate Strategy (Instant 0ms load)
  if (request.destination === 'script' || request.destination === 'style' || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Navigation / HTML pages: Network First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cached) => cached || caches.match('/'));
        })
    );
  }
});
