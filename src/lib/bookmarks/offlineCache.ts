import { browser } from "$app/environment";
import { get } from "svelte/store";
import { settingsStore } from "$lib/settings/settings.store";

export const BOOKMARK_CACHE = "duas-pro-bookmarks";
const MANIFEST_PREFIX = "/_bookmark_manifest/";

export async function cacheBookmarkContent(slug: string, imageUrl: string, audioUrls: string[] = []) {
  if (!browser || !("caches" in window)) return;

  const lang = get(settingsStore).systemLanguage;
  const urlsToCache = [`/${lang}/duas/${slug}`, imageUrl, ...audioUrls].filter(Boolean) as string[];

  try {
    const cache = await caches.open(BOOKMARK_CACHE);

    await cache.put(
      MANIFEST_PREFIX + slug,
      new Response(JSON.stringify(urlsToCache), { headers: { "Content-Type": "application/json" } }),
    );

    await Promise.allSettled(
      urlsToCache.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) await cache.put(url, response.clone());
        } catch {}
      }),
    );
  } catch (e) {
    console.warn("Failed to cache bookmark content:", e);
  }
}

export async function uncacheBookmarkContent(slug: string) {
  if (!browser || !("caches" in window)) return;

  try {
    const cache = await caches.open(BOOKMARK_CACHE);
    const manifest = await cache.match(MANIFEST_PREFIX + slug);
    if (manifest) {
      const urls: string[] = await manifest.json();
      await Promise.all([
        ...urls.map((url) => cache.delete(url)),
        cache.delete(MANIFEST_PREFIX + slug),
      ]);
    }
  } catch (e) {
    console.warn("Failed to uncache bookmark content:", e);
  }
}
