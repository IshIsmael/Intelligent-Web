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
    if (request.url.includes('offline-plant-info')) {
      const responseFromCache = await caches.match('/offline-plant-info/999');

      return responseFromCache;
    }

    const responseFromNetwork = await fetch(request);

    if (
      !(
        request.method === 'POST' ||
        request.method === 'PUT' ||
        request.url.includes('transport') ||
        request.url.includes('offline-plant-info')
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

const insertMongoMessage = async function (messageObj) {
  try {
    const url = '/newMessage';
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(messageObj),
    };

    await fetch(url, options);
  } catch (err) {
    console.log(err);
  }
};

const syncMessages = function () {
  const messagesDB = indexedDB.open('messages');

  messagesDB.onerror = event => {
    console.log(event.target.errorCode);
  };

  messagesDB.onupgradeneeded = event => {
    const db = event.target.result;

    const objectStore = db.createObjectStore('messages', { keyPath: 'id' });
  };

  messagesDB.onsuccess = event => {
    const objectStore = event.target.result
      .transaction('messages', 'readwrite')
      .objectStore('messages');

    const request = objectStore.getAll();

    request.onsuccess = () => {
      request.result.forEach(obj => {
        obj.messages.forEach(messageObj => {
          insertMongoMessage({ id: obj.id, ...messageObj });
        });

        objectStore.delete(obj.id);
      });
    };
  };
};

async function addToDb(obj) {
  try {
    const url = '/submit-plant-sighting';
    const options = {
      method: 'POST',
      body: obj,
    };

    await fetch(url, options);
  } catch (err) {
    console.log(err);
  }
}

const syncPosts = function () {
  const sightingDB = indexedDB.open('sightings');

  sightingDB.onerror = event => {
    console.log(event.target.errorCode);
  };

  sightingDB.onupgradeneeded = event => {
    const db = event.target.result;

    const objectStore = db.createObjectStore('messages', { keyPath: 'id' });
  };

  sightingDB.onsuccess = event => {
    const db = event.target.result;

    const objectStore = db
      .transaction('sightings', 'readwrite')
      .objectStore('sightings');

    const results = objectStore.getAll();

    results.onsuccess = () => {
      console.log();

      results.result.forEach(post => {
        const form_data = new FormData();

        for (const key in post) {
          if (key === 'comments') {
            form_data.append(key, JSON.stringify(post[key]));
          } else {
            form_data.append(key, post[key]);
          }
        }
        addToDb(form_data);
      });

      objectStore.clear();
    };
  };
};

self.addEventListener('install', event => {
  event.waitUntil(
    addResourcesToCache([
      '/',
      '/offline-plant-info/999',
      '/javascripts/offlinePlantInfo.js',
    ])
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(networkFirst(event.request));
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }

  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});
