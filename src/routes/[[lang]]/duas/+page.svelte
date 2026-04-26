<script lang="ts">
  import Pagination from "$lib/dua-discovery/Pagination.svelte";
  import FilterPanel from "$lib/dua-discovery/FilterPanel.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import { t } from "$lib/translations/i18n";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import DuaGrid from "$lib/dua-discovery/DuaGrid.svelte";
  import BookmarkedDuas from "$lib/bookmarks/BookmarkedDuas.svelte";

  let { data } = $props();
  let selectedTypes = $derived(page.url.searchParams.getAll("types"));
  let filterPanelOpen = $state(false);
  let searchTerm = $state(page.url.searchParams.get("search-word") ?? "");
  let urlSearchWord = $derived(page.url.searchParams.get("search-word") ?? "");

  $effect(() => {
    searchTerm = urlSearchWord;
  });

  let debounceTimer: ReturnType<typeof setTimeout>;

  function handleSearchInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const params = new URLSearchParams(page.url.searchParams);
      if (searchTerm.trim()) {
        params.set("search-word", searchTerm.trim());
      } else {
        params.delete("search-word");
      }
      params.set("page", "1");
      goto(`${page.url.pathname}?${params.toString()}`, { replaceState: true });
    }, 400);
  }

  function removeTypeFilter(typeToRemove: string) {
    const params = new URLSearchParams(page.url.searchParams);

    const remainingTypes = params.getAll("types").filter((t) => t !== typeToRemove);
    params.delete("types");
    remainingTypes.forEach((t) => params.append("types", t));
    params.set("page", "1");

    goto(`${page.url.pathname}?${params.toString()}`, { replaceState: true });
  }
</script>

<SeoHead title={$t("seo.home.title")} description={$t("seo.home.description")} type="organization" />

<div class="p-4 sm:p-6 md:p-8">
  <div class="mx-auto max-w-3xl text-center mb-6">
    <h1 class="text-3xl font-bold tracking-tight">
      {$t("seo.home.title")}
    </h1>
    <p class="mt-3 text-base text-gray-700 dark:text-gray-300">
      {$t("seo.home.description") ?? 
        "Browse, search and filter authentic duas by topic, narrator or book."}
    </p>
  </div>

  <BookmarkedDuas />

  <!-- 🔍 Suche + Filter -->
  <div class="mb-6 mt-2 flex w-full gap-2 sm:mt-0 sm:w-auto">
    <input
      type="text"
      placeholder={"Search duas..."}
      class="w-full flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 sm:w-64"
      bind:value={searchTerm}
      oninput={handleSearchInput} />
    <Sheet.Root bind:open={filterPanelOpen}>
      <Sheet.Trigger class="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
        {"Filter"}
      </Sheet.Trigger>
      <Sheet.Content side="right" class="p-0">
        <FilterPanel bind:filterPanelOpen />
      </Sheet.Content>
    </Sheet.Root>
  </div>
  {#if selectedTypes.length > 0}
    <div class="mb-4 mt-4 flex flex-wrap gap-2">
      {#each selectedTypes as type}
        <div
          class="flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-3 py-1 text-sm text-primary">
          <span>Typ: {type}</span>
          <button class="ml-1 text-primary hover:text-red-600 focus:outline-none" onclick={() => removeTypeFilter(type)}>
            ✕
          </button>
        </div>
      {/each}
    </div>
  {/if}

   <DuaGrid duas={data.duas} />

   <Pagination totalPages={data.pagination.totalPages} totalCount={data.pagination.totalCount} />
</div>
