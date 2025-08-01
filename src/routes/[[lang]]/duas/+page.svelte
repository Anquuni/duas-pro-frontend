<script lang="ts">
  import DuaCard from "$lib/dua-discovery/DuaCard.svelte";
  import Pagination from "$lib/dua-discovery/Pagination.svelte";
  import FilterPanel from "$lib/dua-discovery/FilterPanel.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import { t } from "$lib/translations/i18n";
  import * as Sheet from "$lib/components/ui/sheet/index.js";

  // TODO: Add a full-text search

  let { data } = $props();
  let filterPanelOpen = $state(false);
</script>

<SeoHead title={$t("seo.home.title")} description={$t("seo.home.description")} type="organization" />

<!-- Hauptbereich mit Sidebar + Grid lg:flex lg:gap-8 -->
<div class="p-4 sm:p-6 md:p-8">
  <!-- 📚 Filter Sidebar (nur Desktop sichtbar)  use ScrollArea as component? -->
  <!-- <div class="hidden lg:block w-64 sticky">
    <FilterPanel />
  </div> -->

  <!-- 🔘 Mobile Filter Button (nur sichtbar unter lg) lg:hidden -->
  <div class="mb-4 flex justify-end px-4">
    <Sheet.Root bind:open={filterPanelOpen}>
      <Sheet.Trigger>Filter</Sheet.Trigger>
      <Sheet.Content side="right" class="p-0">
        <FilterPanel bind:filterPanelOpen={filterPanelOpen} />
      </Sheet.Content>
    </Sheet.Root>
  </div>

  <!-- 📜 Duas Grid -->
  <div class="flex-1">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {#each data.duas as dua}
        <DuaCard {dua} />
      {/each}
    </div>

    <Pagination
      totalPages={data.pagination.totalPages}
      totalCount={data.pagination.totalCount} />
  </div>
</div>
