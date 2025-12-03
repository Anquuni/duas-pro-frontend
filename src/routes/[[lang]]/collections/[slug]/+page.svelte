<script lang="ts">
  import DuaGrid from "$lib/dua-discovery/DuaGrid.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import { settingsStore } from "$lib/settings/settings.store.js";

  let { data } = $props();
</script>

{#if data.pagination.totalCount === 0}
  <div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
    <h2 class="text-lg font-medium text-gray-700">Noch keine Duas vorhanden</h2>
    <p class="mt-1 text-sm text-gray-500">Diese Sammlung hat aktuell keine Inhalte.</p>
  </div>
{:else}
  <SeoHead
    title={data.collection.title[$settingsStore.systemLanguage]}
    description={data.collection.seo_description[$settingsStore.systemLanguage]}
    type="organization" />

  <div class="p-4 sm:p-6 md:p-8">
    <h1 class="text-2xl font-semibold">{data.collection.title[$settingsStore.systemLanguage]}</h1>
    <p class="mb-2 mt-1 text-sm text-gray-600">
      {data.collection.description[$settingsStore.systemLanguage]}
    </p>

    <DuaGrid duas={data.duas} />
  </div>
{/if}
