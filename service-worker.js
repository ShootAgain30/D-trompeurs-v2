const CACHE_NAME = 'detrompeurs-V2.0.5';
const FILES = [
  './',
  'index.html',
  'quais.html',
  'manifest.json',
  'data.json',
  'Icon-192.png',
  'Icon-512.png',
  'Carrefour NB.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES.map(f => new Request(f, { cache: 'reload' })));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true, ignoreVary: true })
      .then(function(response) {
        return response || fetch(e.request).catch(function() {
          return new Response('', { status: 404 });
        });
      })
  );
});
