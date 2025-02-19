<script lang="ts">
  import DuaCard from "$lib/dua-discovery/DuaCard.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import { supabase } from "$lib/supabase.config";
  import type { Dua } from "../../../ambient";

  let searchQuery = $state("");
  let selectedType = $state("Alle");
  let sortByPopularity = $state(false);
  let duas: Dua[] = $state([]);
  let loading = $state(false);

  let types = ["Alle", "Bittgebete", "Ziyarat", "Gebete", "Tasbihat", "Munajat"];

  async function fetchDuas() {
    loading = true;
    console.log("start fetching");
    const { data, error } = await supabase.functions.invoke(`duas?languages=ar,tl,en&page=1&size=100`); // &search=${searchQuery}&type=${selectedType}&popular=${sortByPopularity}
    if (error) {
      console.error("Error fetching duas:", error);
    }
    duas = data.data;
    console.log("fertig fetching ");
    loading = false;
  }

  // Neue Duas abrufen, wenn eine Änderung erfolgt
  $effect(() => {
    fetchDuas();
  });
</script>

<SeoHead title="Discover and search Duas" />

<div class="p-4 sm:p-6 md:p-8">
  <!-- Suchleiste, Filter und Sortierung -->
  <div class="mb-6 flex flex-col gap-4 md:flex-row">
    <!-- Suchleiste -->
    <input type="text" bind:value={searchQuery} placeholder="Suche nach Duas..." class="flex-1 rounded-md border p-2" />

    <!-- Typ-Filter -->
    <select bind:value={selectedType} class="rounded-md border p-2">
      {#each types as type}
        <option value={type}>{type}</option>
      {/each}
    </select>

    <!-- Sortierung nach Beliebtheit -->
    <button
      onclick={() => (sortByPopularity = !sortByPopularity)}
      class="rounded-md border bg-gray-100 p-2 hover:bg-gray-200">
      {sortByPopularity ? "Nach Beliebtheit: Hoch -> Niedrig" : "Standard-Sortierung"}
    </button>
  </div>

  {#if loading}
    <p class="text-center">Lade Duas...</p>
  {:else}
    <!-- Duas Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each duas as dua}
        <DuaCard {dua} />
      {/each}
    </div>
  {/if}
</div>
