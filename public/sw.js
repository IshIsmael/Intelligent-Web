const addResourcesToCache = async resources => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  if (request.method === 'POST' || request.method === 'PUT') return;

  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const networkFirst = async request => {
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (err) {
    const responseFromCache = await caches.match(request);
    return responseFromCache;
  }
};

self.addEventListener('install', event => {
  event.waitUntil(addResourcesToCache(['/']));
});

self.addEventListener('fetch', event => {
  event.respondWith(networkFirst(event.request));
});
