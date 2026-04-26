/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, version } from "$service-worker";

declare let self: ServiceWorkerGlobalScope;

const CACHE = `duas-pro-${version}`;
// Static assets that are safe to cache indefinitely
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
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests (Supabase API, CDN, etc.)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);

      // Serve pre-cached build assets directly from cache (immutable)
      if (ASSETS.includes(url.pathname)) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
      }

      // For navigation and other requests: network first, fall back to cache
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
