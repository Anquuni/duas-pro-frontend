<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import { settingsStore } from "$lib/settings/settings.store";
  import { onMount } from "svelte";

  let { lines } = $props();
  let headerHeight: number = $state(0);
  let audioPlayerHeight: number = $state(0);

  onMount(() => {
    const updateHeights = () => {
      const header = document.querySelector("header");
      const audioPlayer = document.querySelector(".audio-player"); // Annahme: Ihr Audioplayer hat diese Klasse
      headerHeight = header ? header.offsetHeight : 0;
      audioPlayerHeight = audioPlayer ? audioPlayer.offsetHeight : 0;
    };

    updateHeights();
    window.addEventListener("resize", updateHeights);

    return () => {
      window.removeEventListener("resize", updateHeights);
    };
  });
</script>

<div class="flex flex-col" style="height: calc(100vh - 30px - {audioPlayerHeight}px);">
  <Card class="flex-grow overflow-auto">
    <CardContent class="flex h-full items-center justify-center p-6">
      <div class="max-w-2xl space-y-4 text-center">
        <p class="primary-dua-font-size arabic-font">
          {lines[$duaStore.currentVerse]["ar"]}
        </p>
        {#if $settingsStore.showTranslit}
          <p class="secondary-dua-font-size">
            {lines[$duaStore.currentVerse]["translit"]}
          </p>
        {/if}
        {#if $settingsStore.systemLanguage !== "ar"}
          <p class="tertiary-dua-font-size">
            {lines[$duaStore.currentVerse][$settingsStore.systemLanguage]}
          </p>
        {/if}
      </div>
    </CardContent>
  </Card>
</div>
