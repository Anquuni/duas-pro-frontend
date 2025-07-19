<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ChevronRight, ChevronLeft, Check } from "lucide-svelte";
  import { clickOutside } from "./clickOutside";
  import type { Reciter } from "../../../ambient";
  import { t } from "$lib/translations/i18n";

  export let playbackRate: number;
  export let currentReciter: string | null;
  export let speeds: number[];
  export let reciters: Reciter[];

  const dispatch = createEventDispatcher();

  let activeSubmenu: "settings" | "speed" | "reciter" = "settings";

  function setPlaybackRate(rate: number) {
    dispatch("setPlaybackRate", rate);
    activeSubmenu = "settings";
  }

  function setReciter(reciter: string) {
    dispatch("setReciter", reciter);
    activeSubmenu = "settings";
  }

  function closePopover() {
    dispatch("close");
  }

  function goBack() {
    activeSubmenu = "settings";
  }
</script>

<div
  class="absolute bottom-full right-0 mb-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
  use:clickOutside
  on:clickoutside={closePopover}>
  {#if activeSubmenu === "settings"}
    <div class="py-1">
      <button
        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        on:click={() => (activeSubmenu = "speed")}>
        {$t("audio.speed")}
        <span class="float-right flex items-center">
          {playbackRate}x
          <ChevronRight class="ml-2 h-5 w-5" />
        </span>
      </button>
      <button
        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        on:click={() => (activeSubmenu = "reciter")}>
        {$t("audio.reciter")}
        <span class="float-right flex items-center">
          {currentReciter}
          <ChevronRight class="ml-2 h-5 w-5" />
        </span>
      </button>
    </div>
  {:else if activeSubmenu === "speed"}
    <div class="py-1">
      <button class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" on:click={goBack}>
        <ChevronLeft class="mr-2 inline-block h-5 w-5" />
        {$t("audio.back-to-settings")}
      </button>
      {#each speeds as speed}
        <button
          class="block w-full px-4 py-2 text-left text-sm {playbackRate === speed
            ? 'bg-blue-100 font-semibold text-blue-900'
            : 'text-gray-700'} relative hover:bg-gray-100"
          on:click={() => setPlaybackRate(speed)}>
          {speed}x
          {#if playbackRate === speed}
            <Check class="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform text-blue-500" />
          {/if}
        </button>
      {/each}
    </div>
  {:else if activeSubmenu === "reciter"}
    <div class="py-1">
      <button class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" on:click={goBack}>
        <ChevronLeft class="mr-2 inline-block h-5 w-5" />
        {$t("audio.back-to-settings")}
      </button>
      {#each reciters as reciter}
        <button
          class="flex w-full items-center px-4 py-2 text-left text-sm {currentReciter === reciter.full_name_tl
            ? 'bg-blue-100 font-semibold text-blue-900'
            : 'text-gray-700'} relative hover:bg-gray-100"
          on:click={() => setReciter(reciter.full_name_tl)}>
          <!-- Profilbild -->
          <img
            src={reciter.profile_image_url}
            alt={reciter.full_name_tl}
            class="mr-3 h-8 w-8 rounded-full object-cover" />

          <!-- Name des Rezitators -->
          <span>{reciter.full_name_tl}</span>

          <!-- Haken für den aktuellen Rezitator -->
          {#if currentReciter === reciter.full_name_tl}
            <Check class="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform text-blue-500" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
