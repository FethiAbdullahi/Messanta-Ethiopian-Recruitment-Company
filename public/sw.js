/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'skills-for-life-v3';

/**
 * Only handle cache-friendly GETs. Next.js, APIs, and RSC must bypass the SW
 * or you get opaque errors / "500 (from service worker)" in DevTools.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }

  if (!shouldInterceptGetForRequest(url, event.request)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone).catch(() => {
              /* quota or non-cacheable body */
            });
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

function shouldInterceptGetForRequest(url, request) {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  if (url.origin !== self.location.origin) return false;

  const path = url.pathname;
  if (path.startsWith('/api/')) return false;
  if (path.startsWith('/_next/')) return false;
  if (path.startsWith('/auth/')) return false;
  if (url.searchParams.has('_rsc')) return false;
  if (request.mode === 'navigate') return false;

  const okDest = ['image', 'font', 'style'].includes(request.destination);
  const ext = path.match(/\.(ico|png|jpg|jpeg|webp|gif|svg|woff2?|ttf|css)$/i);
  if (okDest || ext) return true;
  if (path === '/manifest.json' || path.startsWith('/icons/')) return true;

  return false;
}
