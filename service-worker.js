const CACHE_NAME = 'mundial-2026-control-v15';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './vix_links.json', './icons/icon-192.png', './icons/icon-512.png', './assets/info.png'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(url.pathname.endsWith('/vix_links.json')) {
    event.respondWith(fetch(event.request, {cache:'no-store'}).then(resp => { const copy=resp.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); return resp; }).catch(()=>caches.match(event.request)));
    return;
  }
  if(event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(resp => { const copy=resp.clone(); caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy)); return resp; }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
