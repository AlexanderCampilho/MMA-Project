// Minimal shell cache. Network-first so live fixes/results show up immediately;
// the cache only kicks in when offline. Supabase/API calls always go to the network.
const CACHE = 'cage-clash-v2';
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
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy));
      }
      return res;
    }).catch(() => caches.match(event.request))
  );
});
