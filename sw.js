const VERSION = 'v1';
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const OFFLINE = '/offline.html';
const STATIC_EXT = /\.(css|js|webp|png|jpe?g|svg|woff2?|ico|webmanifest|json)$/;

// Ключевые страницы — скачиваются в фоне при установке,
// доступны офлайн ещё до первого посещения
const PRECACHE = [
  OFFLINE,
  '/',
  '/uslugi/',
  '/kontakty/',
  '/o-nas/',
  '/faq/',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(PAGES)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Страницы: network-first, офлайн — кэш, иначе offline.html
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match(OFFLINE)))
    );
    return;
  }

  // Статика: stale-while-revalidate
  if (STATIC_EXT.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const refresh = fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || refresh;
      })
    );
  }
});
