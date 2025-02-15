<script lang="ts">
  import { headerStore } from "$lib/header/header.store";
  import DefaultHeader from "./DefaultHeader.svelte";
  import DuaHeader from "./DuaHeader.svelte";

  function getHeaderHeight() {
    if (!$headerStore.isDuaPage) {
      return 60;
    }
    return $headerStore.isExpandedHeader ? 90 : 30;
  }
</script>

<header
  class="sticky top-0 z-30 w-full bg-background/100 shadow-md transition-all duration-300"
  style="height: {getHeaderHeight() + 'px'};">
  <div class="relative h-full overflow-hidden">
    <div
      class="absolute w-full transition-transform duration-300"
      class:translate-y-0={$headerStore.isExpandedHeader}
      class:-translate-y-full={!$headerStore.isExpandedHeader}>
      <DefaultHeader />
    </div>
    {#if $headerStore.isDuaPage}
      <div class="absolute bottom-0 w-full">
        <DuaHeader />
      </div>
    {/if}
  </div>
</header>
