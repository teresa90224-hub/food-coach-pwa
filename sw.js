const CACHE='food-coach-v8';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // 自己網站的檔案一律跟伺服器確認是否有新版（不吃瀏覽器 10 分鐘快取），離線才用快取
  // 外部檔案（AI 模型、函式庫）不經過這裡，交給瀏覽器直接下載
  if(new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith(fetch(e.request.url,{cache:'no-cache',credentials:'same-origin'}).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;}).catch(()=>caches.match(e.request)));
});
