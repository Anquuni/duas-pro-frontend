<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import AudioPlayer from "$lib/dua-detail/audio-player/AudioPlayer.svelte";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import DuaContent from "$lib/dua-detail/DuaContent.svelte";
  import DuaLineViews from "$lib/dua-detail/DuaLineViews.svelte";
  import { headerStore } from "$lib/header/header.store";
  import HowToLiveReadingDialog from "$lib/live-reading/HowToLiveReadingDialog.svelte";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import { joinLiveReadingRoom, leaveLiveReadingRoom } from "$lib/live-reading/live-reading.utils";
  import SeoHead from "$lib/SEOHead.svelte";
  import { settingsStore } from "$lib/settings/settings.store.js";
  import { onMount } from "svelte";

  // TODO: Rename folder of components to dua-reader

  let { data } = $props();

  let viewTabsElement: HTMLElement;
  let scrollReference = 0;
  let scrollThreshold = 75; // Schwellenwert für Header-Änderungen

  onMount(() => {
    liveReadingStore.update((state) => ({
      ...state,
      duaRouteName: data.routeName,
    }));
    const liveReadingRoomCode = data.code;
    if (liveReadingRoomCode) {
      joinLiveReadingRoom(liveReadingRoomCode);
    }

    headerStore.update((state) => ({
      ...state,
      duaTitle: data.dua.title[$settingsStore.systemLanguage],
      showViewTabs: false,
      isDuaPage: true,
      isExpandedHeader: true,
    }));

    // Reset to zero
    duaStore.update((state) => ({ ...state, currentVerse: 0 }));

    const handleScroll = () => {
      const currentScrollTop = Math.round(window.scrollY || document.documentElement.scrollTop);
      // Berechne die Scroll-Distanz seit dem letzten Referenzpunkt
      const scrollDistance = currentScrollTop - scrollReference;

      if (Math.abs(scrollDistance) >= scrollThreshold) {
        const scrollingUp = scrollDistance < 0;

        if (scrollingUp !== $headerStore.isExpandedHeader) {
          headerStore.update((state) => ({
            ...state,
            isExpandedHeader: scrollingUp,
          }));
        }

        // Setze den neuen Referenzpunkt
        scrollReference = currentScrollTop;
      }

      const viewTabsPosition = viewTabsElement?.getBoundingClientRect().top;
      const showViewTabs = viewTabsPosition !== undefined && viewTabsPosition <= 60;
      headerStore.update((state) => ({
        ...state,
        showViewTabs,
      }));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      headerStore.update((state) => ({
        ...state,
        isDuaPage: false,
        showViewTabs: false,
        isExpandedHeader: true,
      }));
    };
  });

  $effect(() => {
    if (typeof window !== "undefined") {
      scrollToCurrentVerse($duaStore.currentVerse);
    }
  });

  function scrollToCurrentVerse(index: number) {
    const verseElement = document.getElementById(`verse-${index}`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function beforeUnload() {
    if ($liveReadingStore.inLiveReadingRoom) {
      leaveLiveReadingRoom();
    }
  }

  beforeNavigate(() => {
    if ($liveReadingStore.inLiveReadingRoom) {
      leaveLiveReadingRoom();
    }
  });
</script>

<SeoHead title={data.dua.title[$settingsStore.systemLanguage]} 
  description={data.dua.description[$settingsStore.systemLanguage]} 
  image={data.dua.image_url} type="webpage" />

<svelte:window on:beforeunload={beforeUnload} />

<HowToLiveReadingDialog />

<div class="container mx-auto px-4 pt-8">
  <DuaContent dua={data.dua} />

  <div class="mb-8 flex justify-center" bind:this={viewTabsElement}>
    <DuaLineViews dua={data.dua} />
  </div>
</div>

<AudioPlayer dua={data.dua} />
