<script lang="ts">
  import DuaCard from "$lib/dua-discovery/DuaCard.svelte";
  import DuaDiscoveryPagination from "$lib/dua-discovery/DuaDiscoveryPagination.svelte";
  import FilterPanel from "$lib/dua-discovery/FilterPanel.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import { settingsStore } from "$lib/settings/settings.store.js";
  import { t } from "$lib/translations/i18n";
  import * as Sheet from "$lib/components/ui/sheet/index.js";

  // TODO: Add Sheet or Drawer component to filter duas
  //   by book (Mafatih-ul-Jinan, Sahifa-Sadschadiyya, ...),
  //   by type (Dua, Ziyarat, Muanajat, ...),
  //   by collection (Ramadan, Imam Mahdi)
  //   by recommended time (today, weekly, monthly, yearly)
  //   by narrator
  //   if has audio or not
  //   by recitator
  //   by reading time
  // TODO: Add a full-text search

  let { data } = $props();
</script>

<SeoHead title={$t("seo.home.title")} description={$t("seo.home.description")} type="organization" />

<div class="p-4 sm:p-6 md:p-8">
  <!-- 📜 Duas Grid -->
  <div class="flex-1">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {#each data.duas as dua}
        <DuaCard {dua} />
      {/each}
    </div>

    <DuaDiscoveryPagination
      currentPage={data.page}
      totalItems={81}
      itemsPerPage={data.size}
      baseUrl="/{$settingsStore.systemLanguage}/duas" />
  </div>
</div>
