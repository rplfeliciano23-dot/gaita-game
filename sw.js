// Gaita Bem-te-vi - service worker. Busca sempre a versão mais nova na internet
// e usa a cópia guardada só quando estiver sem conexão.
const V='gaita-bem-te-vi-v6';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./mascote-bem-te-vi.png','./textura-tronco.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request,{cache:'no-cache'}).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r})
    .catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html')))
  );
});
