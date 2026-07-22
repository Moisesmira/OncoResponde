const CACHE = 'oncoresponde-3.2.4-brand';
const APP_SHELL = ['/manifest.webmanifest', '/brand/icon-192.png', '/brand/icon-512.png', '/brand/apple-touch-icon.png', '/brand/logo-oncoresponde.png', '/assets/camino.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/sw.js')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok && url.origin === self.location.origin) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
