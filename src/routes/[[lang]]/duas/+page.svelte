<script lang="ts">
  import DuaCard from "$lib/dua-discovery/DuaCard.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import logo from '$lib/assets/duas-pro-logo.svg';
  import { t } from "$lib/translations/i18n";

  // TODO: Add filtering by book (Mafatih-ul-Jinan, Sahifa-Sadschadiyya, ...)
  //  and by type (Dua, Ziyarat, Muanajat, ...) and a search
  // TODO: Create pagination component

  let { data } = $props();
</script>

<SeoHead title={$t("seo.home.title")} description={$t("seo.home.description")} image={logo} type="organization" />

<div class="p-4 sm:p-6 md:p-8">
  <!-- Duas Grid -->
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#each data.duas as dua}
      <DuaCard {dua} />
    {/each}
  </div>
</div>
