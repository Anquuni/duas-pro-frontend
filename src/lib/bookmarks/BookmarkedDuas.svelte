<script lang="ts">
  import { bookmarksStore, toggleBookmark } from "$lib/bookmarks/bookmarks.store";
  import { settingsStore } from "$lib/settings/settings.store";
  import { X } from "@lucide/svelte";
</script>

{#if $bookmarksStore.length > 0}
  <div class="mb-6">
    <h2 class="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Bookmarks</h2>
    <div class="scroll-container flex gap-3 overflow-x-auto pb-2">
      {#each $bookmarksStore as dua}
        <a
          href="/{$settingsStore.systemLanguage}/duas/{dua.slug}"
          class="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg shadow transition-transform active:scale-95">
          <img src={dua.image_url} alt={dua.title["translit"]} class="absolute inset-0 h-full w-full object-cover" />
          <div class="absolute inset-0 bg-black/50"></div>
          <div class="relative z-10 flex h-full flex-col justify-end p-2">
            <span class="line-clamp-2 text-xs font-semibold leading-tight text-white">
              {dua.title["translit"]}
            </span>
          </div>
          <button
            onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(dua); }}
            aria-label="Remove bookmark"
            class="absolute right-1 top-1 z-20 rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70">
            <X size={12} />
          </button>
        </a>
      {/each}
    </div>
  </div>
{/if}

<style>
  .scroll-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scroll-container::-webkit-scrollbar {
    display: none;
  }
</style>
