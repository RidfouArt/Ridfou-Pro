/* PWA offline cache — scoped to the same GitHub Pages repository. */
const CACHE='ridfou-accroche-v1-20261107';
const APP=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('ridfou-accroche-')&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()]));
});
self.addEventListener('message',event=>{
 if(event.data?.type==='CACHE_APP')event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP)).catch(()=>{}));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(resp=>{if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{});}return resp}).catch(async()=>{
   const cache=await caches.open(CACHE);
   return await cache.match(req,{ignoreSearch:true})||await cache.match('./index.html')||Response.error();
  }));return;
 }
 event.respondWith(caches.match(req,{ignoreSearch:true}).then(cached=>cached||fetch(req).then(resp=>{
  if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{});}return resp;
 })));
});
