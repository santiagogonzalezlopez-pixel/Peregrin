const CACHE_NAME = 'peregrin-v2';
const ASSETS = ['/', '/index.html', '/manifest.json', '/privacy.html', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  e.respondWith(
    url.origin === self.location.origin
      ? caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
          return response;
        }).catch(() => caches.match('/index.html')))
      : fetch(e.request).catch(() => caches.match(e.request))
  );
});
