import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { cacheBookmarkContent, uncacheBookmarkContent } from "./offlineCache";

export interface BookmarkedDua {
  slug: string;
  title: { [key: string]: string };
  image_url: string;
}

function loadBookmarks(): BookmarkedDua[] {
  if (!browser) return [];
  try {
    const raw = localStorage.getItem("bookmarks");
    if (!raw) return [];
    return JSON.parse(raw) as BookmarkedDua[];
  } catch {
    return [];
  }
}

export const bookmarksStore = writable<BookmarkedDua[]>(loadBookmarks());

if (browser) {
  bookmarksStore.subscribe((bookmarks) => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  });
}

export function toggleBookmark(dua: BookmarkedDua, audioUrls: string[] = []) {
  bookmarksStore.update((bookmarks) => {
    const exists = bookmarks.some((b) => b.slug === dua.slug);
    if (exists) {
      uncacheBookmarkContent(dua.slug);
      return bookmarks.filter((b) => b.slug !== dua.slug);
    } else {
      cacheBookmarkContent(dua.slug, dua.image_url, audioUrls);
      return [...bookmarks, dua];
    }
  });
}
