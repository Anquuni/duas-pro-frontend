<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import { headerStore } from "$lib/header/header.store";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import { showNoHostToast } from "$lib/live-reading/live-reading.utils";
  import { settingsStore } from "$lib/settings/settings.store";
  import { onMount, tick } from "svelte";
  import { fly, fade } from "svelte/transition";

  let { lines } = $props();
  let headerHeight: number = $state(0);
  let audioPlayerHeight: number = $state(0);
  let sectionTitle = $derived(lines[$duaStore.currentVerse]["section_title_" + $settingsStore.systemLanguage]);
  let presentationContainer: HTMLDivElement;

  $effect(() => {
  if ($duaStore.currentView === "presentation") {
    window.scrollTo(0, document.body.scrollHeight);
    headerStore.update((state) => ({...state, isExpandedHeader: false}));
    document.body.style.overflow = "hidden";
    tick().then(() => {
      presentationContainer?.focus();
      (document.activeElement as HTMLElement | null)?.blur();
      presentationContainer?.focus();
    });
  } else {
    document.body.style.overflow = "";
  }
  })

  let touchStartX = 0;
  let touchStartY = 0;

  const MIN_SWIPE_DISTANCE = 50;

  function goToPreviousVerse() {
    if ($liveReadingStore.inLiveReadingRoom && !$liveReadingStore.isHost) {
      showNoHostToast();
    } else if ($duaStore.currentVerse > 0) {
      duaStore.update((state) => ({
        ...state,
        currentVerse: state.currentVerse - 1,
      }));
    }
  }

  function goToNextVerse() {
    if ($liveReadingStore.inLiveReadingRoom && !$liveReadingStore.isHost) {
      showNoHostToast();
    } else if ($duaStore.currentVerse < lines.length - 1) {
      duaStore.update((state) => ({
        ...state,
        currentVerse: state.currentVerse + 1,
      }));
    }
  }

  function handleTouchStart(event: TouchEvent) {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function handleTouchEnd(event: TouchEvent) {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    // Nur horizontale Swipes berücksichtigen
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
      if (deltaX < 0) {
        goToNextVerse();     // nach links gewischt
      } else {
        goToPreviousVerse(); // nach rechts gewischt
      }
    }
  }

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

<div bind:this={presentationContainer} 
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd} 
  class="flex flex-col " style="height: calc(100vh - 30px - {audioPlayerHeight}px);">
  <Card class="relative flex-grow overflow-auto">

  {#if sectionTitle}
    {#key sectionTitle}
      <span
        class="section-badge absolute left-3 top-3 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold
        bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
      >
        {sectionTitle}
      </span>
    {/key}
  {/if}

    <CardContent class="flex h-full items-center justify-center p-6">
      <div class="w-full space-y-4 text-center">
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
        {#if $settingsStore.secondTranslationLanguage}
          <p class="second-translation-dua-font-size">
            {lines[$duaStore.currentVerse][$settingsStore.secondTranslationLanguage]}
          </p>
        {/if}
      </div>
    </CardContent>
  </Card>
</div>

<style>
.section-badge {
  animation: sectionFlash 550ms ease-out;
}

@keyframes sectionFlash {
  0% {
    opacity: 0.85;
    transform: scale(0.98);
    box-shadow:
      0 0 0 0 rgba(255, 255, 255, 0),
      0 0 0 0 rgba(255, 255, 255, 0);
  }

  35% {
    opacity: 1;
    transform: scale(1.03);
    box-shadow:
      0 0 0 6px rgba(255, 255, 255, 0.18),
      0 0 18px 6px rgba(255, 255, 255, 0.28);
  }

  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow:
      0 0 0 0 rgba(255, 255, 255, 0),
      0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>