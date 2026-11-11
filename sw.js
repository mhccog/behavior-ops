const C='rc-v6';const F=['./','index.html','style.css','app.js','data.js','manifest.webmanifest','icon.svg','icon-192.png','figure/cues3d.js','figure/viewer.js','figure/person.js','photos/photos.js','ask/ui.js','ask/engine.js','ask/kb.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
