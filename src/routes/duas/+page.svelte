<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { Dua } from '../../ambient';
    import DuaCard from './DuaCard.svelte';

    let searchQuery = "";
    let selectedType = "Alle";
    let sortByPopularity = false;
    let duas: Dua[] = [];
    let loading = false;

    let types = ["Alle", "Bittgebete", "Ziyarat", "Gebete", "Tasbihat", "Munajat"];

    async function fetchDuas() {
        loading = true;
        console.log("start fetching");
        const { data, error } = await supabase.functions.invoke(`duas?languages=ar,tl,en&page=1&size=100`); // &search=${searchQuery}&type=${selectedType}&popular=${sortByPopularity}
        if (error) {
		    console.error('Error fetching duas:', error);
	    }
        duas = data.data;
        console.log("fertig fetching ")
        loading = false;
    }

    // Neue Duas abrufen, wenn eine Änderung erfolgt
    $: fetchDuas();
</script>

<div class="p-4 sm:p-6 md:p-8">
    <!-- Suchleiste, Filter und Sortierung -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
        <!-- Suchleiste -->
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Suche nach Duas..."
            class="border rounded-md p-2 flex-1"
        />

        <!-- Typ-Filter -->
        <select bind:value={selectedType} class="border rounded-md p-2">
            {#each types as type}
                <option value={type}>{type}</option>
            {/each}
        </select>

        <!-- Sortierung nach Beliebtheit -->
        <button
            on:click={() => sortByPopularity = !sortByPopularity}
            class="border rounded-md p-2 bg-gray-100 hover:bg-gray-200"
        >
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
