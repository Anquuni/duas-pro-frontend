<script lang="ts">
  import Pagination from "$lib/dua-discovery/Pagination.svelte";
  import FilterPanel from "$lib/dua-discovery/FilterPanel.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import { t } from "$lib/translations/i18n";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { toast } from "svelte-sonner";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import DuaGrid from "$lib/dua-discovery/DuaGrid.svelte";

  let { data } = $props();
  let selectedTypes = $derived(page.url.searchParams.getAll("types"));
  let filterPanelOpen = $state(false);
  let searchTerm = $state("");

  function handleSearchFocus() {
    toast.info("Search is not implemented yet!", {
      description:
        "Contribute to the project by joining the GitHub community or clicking on Contact in the Footer section",
    });
  }

  function removeTypeFilter(typeToRemove: string) {
    const params = new URLSearchParams(page.url.searchParams);

    const remainingTypes = params.getAll("types").filter((t) => t !== typeToRemove);
    params.delete("types");
    remainingTypes.forEach((t) => params.append("types", t));
    params.delete("page");
    params.append("page", "1");

    goto(`${page.url.pathname}?${params.toString()}`, { replaceState: true });
  }
</script>

<SeoHead title={$t("seo.home.title")} description={$t("seo.home.description")} type="organization" />

<div class="p-4 sm:p-6 md:p-8">
  <h1 class="text-2xl font-semibold">{$t("seo.home.title")}</h1>
  <p class="mb-2 mt-1 text-sm text-gray-600">
    {$t("seo.home.description") ?? "Browse, search and filter authentic duas by topic, narrator or book."}
  </p>

  <!-- 🔍 Suche + Filter -->
  <div class="mb-6 mt-2 flex w-full gap-2 sm:mt-0 sm:w-auto">
    <input
      type="text"
      placeholder={"Search duas..."}
      class="w-full flex-1 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-64"
      bind:value={searchTerm}
      readonly
      onfocus={handleSearchFocus} />
    <Sheet.Root bind:open={filterPanelOpen}>
      <Sheet.Trigger class="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50">
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
