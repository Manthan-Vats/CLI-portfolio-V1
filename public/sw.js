const CACHE_NAME = "terminal-portfolio-v1";
const urlsToCache = [
  "/",
  "/terminal",
  "/gui",
  "/_next/static/css/",
  "/_next/static/js/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});
