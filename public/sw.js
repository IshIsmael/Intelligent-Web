console.log("Service Worker Called...")

self.addEventListener('install', (event) => {
    console.log('[Service Worker] : Installing');
    event.waitUntil(caches.open('core').then((cache) => {
        try{
            cache.addAll([
                '/',
                '/create',
                '/forum',
                '/images/Logo.png',
                '/javascripts/forum.js',
                '/javascripts/index.js',
                '/javascripts/nickname.js',
                '/javascripts/script.js',
                '/javascripts/map.js',
                '/javascripts/autocap.js',
                '/javascripts/nocoord.js',
                '/javascripts/sighting.js',
                '/stylesheets/header.css',
                '/stylesheets/footer.css',
                '/stylesheets/nickname.css',
                '/stylesheets/form.css',
                '/stylesheets/style.css',
            ]);
            console.log('[Service Worker] : Installed');
        }catch{
            console.log('Error Service Worker Install');
        }

    }));
});

// Fetch event to fetch from cache first
self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open('core');
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Service Worker: Fetching from Cache: ', event.request.url);
            return cachedResponse;
        }
        else{
            console.log('Service Worker: Fetching from URL: ', event.request.url);
            return fetch(event.request);
        }
    })());
});