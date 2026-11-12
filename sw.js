var CACHE = 'cierre-v7';
var FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
// Primero lo guardado (funciona sin señal); si hay internet, actualiza en segundo plano para la próxima vez.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (cached) {
      var net = fetch(e.request).then(function (res) { if (res && res.ok) c.put(e.request, res.clone()); return res; }).catch(function () { return cached; });
      return cached || net;
    });
  }));
});
