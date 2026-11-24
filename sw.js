// Gaita Game | Bem-te-vi interativo
const CACHE='gaita-bem-te-vi-v13';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./fundo-natureza.webp','./mascote-bem-te-vi.png','./mascote-bem-te-vi-tocando.png','./textura-tronco.svg','./gaita-architecture.js','./cloud-config.example.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==location.origin)return;event.respondWith(fetch(event.request,{cache:'no-cache'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))))});
