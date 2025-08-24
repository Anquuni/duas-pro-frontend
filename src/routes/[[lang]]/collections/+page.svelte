<script lang="ts">
  import SeoHead from "$lib/SEOHead.svelte";
  import { t } from "$lib/translations/i18n";
  import CollectionCard from "$lib/collections/CollectionCard.svelte";

  let { data } = $props();
</script>

<SeoHead title={$t("seo.collection.title")} description={$t("seo.collection.description")} type="organization" />

<div class="p-4 sm:p-6 md:p-8">
  <h1 class="text-2xl font-semibold">{$t("seo.collection.title")}</h1>
  <p class="mb-6 mt-1 text-sm text-gray-600">
    {$t("seo.collection.description") ?? "Browse, search and filter authentic duas by topic, narrator or book."}
  </p>

  <!-- 📜 Collections Grid -->
  <div class="grid grid-cols-1 content-start items-stretch gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
    {#each data.collections as collection}
      <CollectionCard {collection} />
    {/each}
  </div>
</div>
