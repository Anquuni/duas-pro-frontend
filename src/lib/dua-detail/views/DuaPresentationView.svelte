<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import { settingsStore } from "$lib/settings/settings.store";
  import { onMount } from "svelte";
  import type { DuaLine } from "../../../ambient";

  export let lines: DuaLine[];

  let headerHeight: number;
  let audioPlayerHeight: number;

  onMount(() => {
    const updateHeights = () => {
      const header = document.querySelector("header");
      const audioPlayer = document.querySelector(".audio-player"); // Annahme: Ihr Audioplayer hat diese Klasse
      headerHeight = header ? header.offsetHeight : 0;
      console.log("headerHeight " + headerHeight);
      audioPlayerHeight = audioPlayer ? audioPlayer.offsetHeight : 0;
      console.log("audioPlayerHeight " + audioPlayerHeight);
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
        <p class="font-arabic mb-6 text-4xl">
          {lines[$duaStore.currentVerse]["AR"]}
        </p>
        <p class="mb-4 text-2xl italic">
          {lines[$duaStore.currentVerse]["TL"]}
        </p>
        {#if $settingsStore.systemLanguage !== "AR"}
          <p class="text-xl">
            {lines[$duaStore.currentVerse][$settingsStore.systemLanguage]}
          </p>
        {/if}
      </div>
    </CardContent>
  </Card>
</div>
