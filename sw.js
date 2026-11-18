const CACHE='card-v99';
const FILES=['./','index.html','word.js','sfx.js','bgm/day.mp3','bgm/night.mp3','bgm/classic.mp3','manifest.json','back1.webp','back2.webp','back3.webp','back4.webp','snow_j.webp','snow_g.webp','snow_h.webp','snow_i.webp','bg/day_sky.webp','bg/day_tree_l.webp','bg/day_tree_r.webp','bg/day_field.webp','bg/day_sun.webp','bg/day_cloud1.webp','bg/day_cloud2.webp','bg/day_cloud3.webp','bg/day_cloud4.webp','bg/night_sky.webp','bg/night_town.webp','bg/night_moon.webp','bg/snow_hill.webp','bg/star_sky1.webp','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('card-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
