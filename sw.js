const CACHE_NAME = 'speeddash-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install - cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Fetch - network first for dynamic content
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if(req.method !== 'GET') return;
  // try network, fallback to cache
  e.respondWith(
    fetch(req).then(res => {
      // optionally cache certain responses
      return res;
    }).catch(() => caches.match(req).then(m => m))
  );
});
