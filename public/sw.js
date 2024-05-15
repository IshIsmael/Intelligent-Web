// console.log('Service Worker Called...');

// self.addEventListener('install', event => {
//   console.log('[Service Worker] : Installing');
//   event.waitUntil(
//     caches.open('core').then(cache => {
//       try {
//         cache.addAll([
//           '/',
//           '../create',
//           '../offline_plant_info',
//           '/javascripts/index.js',
//           '/javascripts/map.js',
//           '/javascripts/script.js',
//           '/javascripts/nickname.js',
//           '/javascripts/forum.js',
//           '/javascripts/plantDownloader.js',
//           '/javascripts/offlinePlantInfo.js',
//           '/stylesheets/footer.css',
//           '/stylesheets/form.css',
//           '/stylesheets/header.css',
//           '/stylesheets/style.css',
//           '/stylesheets/nickname.css',
//         ]);
//         console.log('[Service Worker] : Installed');
//       } catch {
//         console.log('Error Service Worker Install');
//       }
//     })
//   );
// });

// // Fetch event to fetch from cache first
// self.addEventListener('fetch', event => {
//   console.log(event);
//   event.respondWith(
//     (async () => {
//       const cache = await caches.open('core');
//       const cachedResponse = await cache.match(event.request);
//       if (cachedResponse) {
//         console.log('Service Worker: Fetching from Cache: ', event.request.url);
//         return cachedResponse;
//       } else {
//         console.log('Service Worker: Fetching from URL: ', event.request.url);
//         return fetch(event.request);
//       }
//     })()
//   );
// });

const addResourcesToCache = async resources => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

self.addEventListener('install', event => {
  event.waitUntil(addResourcesToCache(['/']));
});

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async request => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

self.addEventListener('fetch', event => {
  event.respondWith(cacheFirst(event.request));
});

// self.addEventListener('fetch', event => {
//   console.log(event.request.url);

//   event.respondWith(
//     (async () => {
//       if (cachedResponse) {
//         console.log('Service Worker: Fetching from Cache: ', event.request.url);
//         return cachedResponse;
//       } else {
//         console.log('Service Worker: Fetching from URL: ', event.request.url);
//         if (!event.request.url.includes('newMessage')) {
//           addResourcesToCache([event.request.url]);
//         }
//         return fetch(event.request);
//       }
//     })()
//   );
// });
