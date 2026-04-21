const CACHE_NAME = 'peregrin-v6';
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const appPath = path => `${SCOPE_PATH}${path}`.replace(/\/{2,}/g, '/');
const APP_SHELL = [
  appPath('/'),
  appPath('/index.html'),
  appPath('/manifest.json'),
  appPath('/privacy.html'),
  appPath('/icon-192.png'),
  appPath('/icon-512.png'),
  appPath('/app-data.js'),
  appPath('/certificates.js')
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)));
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
  const accept = e.request.headers.get('accept') || '';
  const isHtmlRequest = e.request.mode === 'navigate' || accept.includes('text/html');
  e.respondWith(
    url.origin !== self.location.origin
      ? fetch(e.request).catch(() => caches.match(e.request))
      : isHtmlRequest
        ? fetch(e.request).then(response => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
            }
            return response;
          }).catch(() => caches.match(e.request).then(cached => cached || caches.match(appPath('/index.html'))))
        : caches.match(e.request).then(cached => {
            const networkFetch = fetch(e.request).then(response => {
              if (response && response.ok) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
              }
              return response;
            }).catch(() => null);
            return cached || networkFetch;
          })
  );
});
