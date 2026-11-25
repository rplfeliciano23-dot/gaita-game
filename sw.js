// Gaita Game | Bem-te-vi interativo v14
// Cache isolado para não apagar nem devolver arquivos de outros aplicativos no mesmo domínio.
const CACHE_PREFIX = 'gaita-bem-te-vi-';
const CACHE = CACHE_PREFIX + 'v14';
const FILES = [
  './', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fundo-natureza.webp', './mascote-bem-te-vi.png', './mascote-bem-te-vi-tocando.png',
  './textura-tronco.svg', './gaita-architecture.js', './cloud-config.example.js'
];
const APP_ASSETS = new Set(FILES.map(file => new URL(file, self.location.href).href));

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const isNavigation = request.mode === 'navigate';
  if (!isNavigation && !APP_ASSETS.has(url.href)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (isNavigation) {
        const appShell = await cache.match(new URL('./index.html', self.location.href).href);
        if (appShell) return appShell;
      }
      return new Response('Conteúdo indisponível offline.', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
