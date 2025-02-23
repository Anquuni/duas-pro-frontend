<script lang="ts">
  import DuaCard from "$lib/dua-discovery/DuaCard.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import type { Dua } from "../../../ambient";

  // TODO: Add filtering by book (Mafatih-ul-Jinan, Sahifa-Sadschadiyya, ...)
  //  and by type (Dua, Ziyarat, Muanajat, ...) and a search
  // TODO: Create pagination component

  let { data } = $props();
  let duas: Dua[] = data.duas;
</script>

<SeoHead title="Discover and search Duas" />

<div class="p-4 sm:p-6 md:p-8">
  <!-- Duas Grid -->
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#each duas as dua}
      <DuaCard {dua} />
    {/each}
  </div>
</div>
