/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AssetCache & Preloader Engine
 * Handles in-memory GPU texture caching, background asset prefetching,
 * and Service Worker cache registration for instant 0ms transitions.
 */

import * as THREE from 'three';

// Global texture cache: Prevents redundant GPU uploads & garbage collection
const textureCache = new Map<string, THREE.Texture>();
const texturePromises = new Map<string, Promise<THREE.Texture>>();

/**
 * Creates a procedural architectural canvas texture for graceful fallbacks
 */
function createFallbackTexture(url: string): THREE.Texture {
  if (typeof document === 'undefined') {
    return new THREE.Texture();
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich dark luxury neoclassical gradient
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 360);
    grad.addColorStop(0, '#1E2D28');
    grad.addColorStop(0.6, '#0F1A16');
    grad.addColorStop(1, '#060B0A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Warm architectural gold filigree border
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 472, 472);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, 448, 448);

    // Subtle typography watermark
    ctx.fillStyle = '#D97706';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.fillText('HEAVEN BESPOKE', 256, 245);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '12px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('EST. 2002 • CHATTOGRAM', 256, 280);
  }

  const fallbackTexture = new THREE.CanvasTexture(canvas);
  fallbackTexture.colorSpace = THREE.SRGBColorSpace;
  fallbackTexture.minFilter = THREE.LinearFilter;
  fallbackTexture.magFilter = THREE.LinearFilter;
  fallbackTexture.generateMipmaps = false;
  fallbackTexture.needsUpdate = true;
  return fallbackTexture;
}

/**
 * Loads and caches a Three.js texture with high-efficiency texture settings and resilient fallback
 */
export function getOrLoadTexture(
  loader: THREE.TextureLoader,
  url: string,
  onLoad?: (texture: THREE.Texture) => void
): THREE.Texture | null {
  if (textureCache.has(url)) {
    const cached = textureCache.get(url)!;
    if (onLoad) onLoad(cached);
    return cached;
  }

  // Ensure loader has crossOrigin anonymous set
  loader.setCrossOrigin('anonymous');

  // If not yet cached, initiate load
  loader.load(
    url,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      textureCache.set(url, texture);
      if (onLoad) onLoad(texture);
    },
    undefined,
    () => {
      // Graceful procedural fallback without noisy console warnings
      const fallback = createFallbackTexture(url);
      textureCache.set(url, fallback);
      if (onLoad) onLoad(fallback);
    }
  );

  return null;
}

/**
 * Pre-decodes critical images in the background using browser idle cycles.
 * Calling .decode() loads the image into GPU memory before the user scrolls or interacts.
 */
export function preloadCriticalImages(urls: string[]) {
  if (typeof window === 'undefined') return;

  const runPreload = () => {
    urls.forEach((url) => {
      const img = new Image();
      // Important: crossOrigin must be set BEFORE src to avoid non-cors caching conflicts
      img.crossOrigin = 'anonymous';
      img.src = url;
      if ('decode' in img) {
        img.decode().catch(() => {
          // Non-blocking fallback
        });
      }
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runPreload, { timeout: 2500 });
  } else {
    setTimeout(runPreload, 1000);
  }
}

/**
 * Service Worker Registration for Instant Precache & Offline Resilience
 */
export function registerAppServiceWorker() {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Check for background updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available silently
                  console.log('[Heaven SW] App shell updated in cache');
                }
              };
            }
          };
        })
        .catch((err) => {
          // Graceful fallback if service workers are disabled (e.g. strict sandbox iframe)
          console.debug('[Heaven SW] ServiceWorker registration skipped:', err?.message || err);
        });
    });
  }
}

/**
 * Intelligent In-Memory + Session Storage API response caching
 */
const memoryApiCache = new Map<string, any>();

export function getCachedApiResponse<T>(key: string): T | null {
  if (memoryApiCache.has(key)) {
    return memoryApiCache.get(key) as T;
  }
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const stored = window.sessionStorage.getItem('hfm_cache_' + key);
      if (stored) {
        const parsed = JSON.parse(stored);
        memoryApiCache.set(key, parsed);
        return parsed as T;
      }
    } catch {
      // Ignore sessionStorage exceptions
    }
  }
  return null;
}

export function setCachedApiResponse(key: string, data: any) {
  memoryApiCache.set(key, data);
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem('hfm_cache_' + key, JSON.stringify(data));
    } catch {
      // Storage quota exceeded or disabled
    }
  }
}

