<script lang="ts">
  import DuaGrid from "$lib/dua-discovery/DuaGrid.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import { settingsStore } from "$lib/settings/settings.store.js";

  let { data } = $props();
</script>

<SeoHead
  title={data.collection.title[$settingsStore.systemLanguage]}
  description={data.collection.seo_description[$settingsStore.systemLanguage]}
  type="organization" />

<div class="p-4 sm:p-6 md:p-8">
  <h1 class="text-2xl font-semibold">{data.collection.title[$settingsStore.systemLanguage]}</h1>
  <p class="mb-2 mt-1 text-sm text-gray-600">
    {data.collection.description[$settingsStore.systemLanguage] ??
      "Browse, search and filter authentic duas by topic, narrator or book."}
  </p>

  <DuaGrid duas={data.duas} />
</div>
