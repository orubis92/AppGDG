/* Service worker GdG CSAIN — offline + aggiornamenti.
   A OGNI NUOVA VERSIONE dell'app: incrementa CACHE (allineata ad APP_VER in index.html). */
const CACHE = 'gdg-csain-v1.15';

const SHELL = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png'
];

/* librerie e font: cache al primo uso, poi disponibili offline */
const RUNTIME_HOSTS = [
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* navigazione: prima la rete (così gli aggiornamenti arrivano subito), cache come riserva offline */
  if (req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => { c.put('./', copy.clone()); c.put('index.html', copy); });
        return res;
      }).catch(() =>
        caches.match('./').then(r => r || caches.match('index.html'))
      )
    );
    return;
  }

  /* shell e risorse runtime (CDN, font): prima la cache, poi la rete con salvataggio */
  const sameOrigin = url.origin === location.origin;
  const runtime = RUNTIME_HOSTS.includes(url.hostname);
  if (!sameOrigin && !runtime) return;

  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
