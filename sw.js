const CACHE_NAME = 'portfolio';
const CACHE_ASSETS = [
  '/',
  '/images',
  '/css',
  '/font',
  '/js',
  '/sass'
];

// Pre-cache assets during the install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_ASSETS))
  );
});

// Clean up old caches during the activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
});

// Network-first strategy for fetching assets
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If the request succeeds, update the cache and return the response
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // If the network request fails, try to get it from the cache
        return caches.match(event.request);
      })
  );
});
