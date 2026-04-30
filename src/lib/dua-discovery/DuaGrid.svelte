<script lang="ts">
  import DuaCard from "$lib/dua-discovery/DuaCard.svelte";

  let { duas, basePath = "duas" }: { duas: any[]; basePath?: string } = $props();
</script>


  <div class="grid grid-cols-1 content-start items-stretch gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
    {#each duas as dua}
      <DuaCard {dua} {basePath} />
    {/each}
  </div>