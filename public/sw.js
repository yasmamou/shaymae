// Service worker Shaymae — léger, sûr (ne touche pas aux API ni à l'auth).
const CACHE = "shaymae-v2";
const PRECACHE = ["/", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // On laisse passer : autres origines, non-GET, API, auth → toujours réseau.
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api")) {
    return;
  }

  // Navigations (pages) : réseau d'abord, repli cache puis accueil.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Assets statiques (_next, images, icônes) : cache d'abord, réseau en repli.
  event.respondWith(
    caches.match(request).then((cached) =>
      cached ||
      fetch(request).then((res) => {
        if (res.ok && (url.pathname.startsWith("/_next/") || /\.(png|jpg|jpeg|webp|svg|woff2?|css|js)$/.test(url.pathname))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      })
    )
  );
});
