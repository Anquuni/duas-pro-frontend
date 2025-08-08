<script lang="ts">
  import { headerStore } from "$lib/header/header.store";
  import DefaultHeader from "./DefaultHeader.svelte";
  import DuaHeader from "./DuaHeader.svelte";

  let { user } = $props();
</script>

<header
  class="sticky top-0 z-30 w-full text-white
        bg-gradient-to-r from-[#0FBFBF] to-[#15BFAE]
        shadow-lg transition-all duration-300"
  class:h-[60px]={!$headerStore.isDuaPage}
  class:h-[90px]={$headerStore.isDuaPage && $headerStore.isExpandedHeader}
  class:h-[30px]={$headerStore.isDuaPage && !$headerStore.isExpandedHeader}>

  <div class="relative h-full overflow-hidden">
    <div class={`absolute w-full transition-transform duration-300 ${
      $headerStore.isExpandedHeader ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <DefaultHeader {user} />
    </div>
    {#if $headerStore.isDuaPage}
      <div class="absolute bottom-0 w-full">
        <DuaHeader />
      </div>
    {/if}
  </div>
</header>
