// Minimal offline-first shell cache. Supabase/API calls always go to the network.
const CACHE = 'cage-clash-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './src/helpers.js',
  './src/data.js',
  './src/supabase-data.js',
  './src/state.js',
  './src/app.jsx'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (url.indexOf('supabase.co') !== -1) return; // never cache live data
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(res => {
        if (res && res.ok && event.request.method === 'GET') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
