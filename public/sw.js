console.log('Service Worker Called...');

self.addEventListener('install', event => {
  console.log('[Service Worker] : Installing');
  event.waitUntil(
    caches.open('core').then(cache => {
      try {
        cache.addAll([
          '/',
          '../create',
          '/javascripts/index.js',
          '/javascripts/map.js',
          '/javascripts/script.js',
          '/javascripts/nickname.js',
          '/javascripts/forum.js',
          '/javascripts/plantDownloader.js',
          '/stylesheets/footer.css',
          '/stylesheets/form.css',
          '/stylesheets/header.css',
          '/stylesheets/style.css',
          '/stylesheets/nickname.css',
        ]);
        console.log('[Service Worker] : Installed');
      } catch {
        console.log('Error Service Worker Install');
      }
    })
  );
});

// Fetch event to fetch from cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const cache = await caches.open('core');
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        console.log('Service Worker: Fetching from Cache: ', event.request.url);
        return cachedResponse;
      } else {
        console.log('Service Worker: Fetching from URL: ', event.request.url);
        return fetch(event.request);
      }
    })()
  );
});
