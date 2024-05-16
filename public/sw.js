const addResourcesToCache = async resources => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const networkFirst = async request => {
  try {
    const responseFromNetwork = await fetch(request);

    if (
      !(
        request.method === 'POST' ||
        request.method === 'PUT' ||
        request.url.includes('transport')
      )
    ) {
      putInCache(request, responseFromNetwork.clone());
    }

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
  // console.log(event);
  event.respondWith(networkFirst(event.request));
});

self.addEventListener('sync', event => {
  console.log('pokemon');
});
