/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, version } from "$service-worker";

declare let self: ServiceWorkerGlobalScope;

const CACHE = `duas-pro-${version}`;
const BOOKMARK_CACHE = "duas-pro-bookmarks";
const ASSETS = [...build, ...files];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE && key !== BOOKMARK_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const url = new URL(event.request.url);

      // Check bookmark cache first — covers cross-origin audio and images
      const bookmarkCache = await caches.open(BOOKMARK_CACHE);
      const bookmarkHit = await bookmarkCache.match(event.request);
      if (bookmarkHit) return bookmarkHit;

      // Skip remaining logic for cross-origin requests
      if (url.origin !== self.location.origin) {
        return fetch(event.request);
      }

      const cache = await caches.open(CACHE);

      // Serve pre-cached build assets directly (immutable, content-hashed)
      if (ASSETS.includes(url.pathname)) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
      }

      // Network-first for navigation and API requests, fall back to cache
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        return new Response("You are offline", { status: 503 });
      }
    })()
  );
});
