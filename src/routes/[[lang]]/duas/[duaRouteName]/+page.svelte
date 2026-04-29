<script lang="ts">
  import { beforeNavigate, goto, replaceState } from "$app/navigation";
  import AudioPlayer from "$lib/dua-detail/audio-player/AudioPlayer.svelte";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import DuaContent from "$lib/dua-detail/DuaContent.svelte";
  import DuaLineViews from "$lib/dua-detail/DuaLineViews.svelte";
  import { headerStore } from "$lib/header/header.store";
  import HowToLiveReadingDialog from "$lib/live-reading/HowToLiveReadingDialog.svelte";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import {
    joinLiveReadingRoom,
    leaveLiveReadingRoom,
    startLiveReadingRoom,
  } from "$lib/live-reading/live-reading.utils";
  import SeoHead from "$lib/SEOHead.svelte";
  import { onMount, tick } from "svelte";
  import { page } from "$app/state";
  import { settingsStore } from "$lib/settings/settings.store";

  // TODO: Rename folder of components to dua-reader

  let { data } = $props();
  let { user } = $derived(data);

  let viewTabsElement: HTMLElement;
  let scrollReference = 0;
  let scrollThreshold = 75; // Schwellenwert für Header-Änderungen

  $effect(() => {
    const code = page.url.searchParams.get("code");
    const isHost = page.url.searchParams.get("isHost") === "true";
    if (code) {
      if (isHost) {
        startLiveReadingRoom(code);
      } else {
        joinLiveReadingRoom(code);
      }
    }
  });

  // Sync currentVerse + currentView -> URL. Use window.history.replaceState
  // instead of replaceState to avoid "router not initialized" error
  $effect(() => {
    const verse = $duaStore.currentVerse;
    const view = $duaStore.currentView;
    const newUrl = new URL(page.url.toString());
    if (verse > 0) {
      newUrl.searchParams.set("verse", String(verse + 1));
    } else {
      newUrl.searchParams.delete("verse");
    }
    if (view && view !== "translation") {
      newUrl.searchParams.set("view", view);
    } else {
      newUrl.searchParams.delete("view");
    }
    const current = window.location.pathname + window.location.search + window.location.hash;
    const next = newUrl.pathname + newUrl.search + newUrl.hash;
    if (current !== next) {
      window.history.replaceState(window.history.state, "", next);
    }
  });

  onMount(() => {
    // Sync lang2 URL param <-> secondTranslationLanguage store
    const lang2FromUrl = page.url.searchParams.get("lang2");
    if (lang2FromUrl) {
      // URL takes precedence (handles shared links / direct navigation)
      settingsStore.update((s) => ({ ...s, secondTranslationLanguage: lang2FromUrl }));
    } else {
      const storeValue = $settingsStore.secondTranslationLanguage;
      if (storeValue) {
        // Store has a saved preference but URL doesn't reflect it → add to URL to trigger re-fetch
        const newUrl = new URL(page.url.toString());
        newUrl.searchParams.set("lang2", storeValue);
        goto(newUrl.toString(), { replaceState: true, noScroll: true, keepFocus: true });
      }
    }

    liveReadingStore.update((state) => ({
      ...state,
      duaRouteName: data.duaSlug,
    }));

    headerStore.update((state) => ({
      ...state,
      duaTitle: data.dua.title["translit"],
      showViewTabs: false,
      isDuaPage: true,
      isExpandedHeader: true,
    }));

    // Restore verse + view from URL, or use defaults
    const verseParam = parseInt(page.url.searchParams.get("verse") ?? "1", 10);
    const initialVerse = Number.isFinite(verseParam) && verseParam > 1 ? verseParam - 1 : 0;
    const validViews = ["translation", "reading", "presentation"];
    const viewParam = page.url.searchParams.get("view") ?? "translation";
    const initialView = validViews.includes(viewParam) ? viewParam : "translation";
    duaStore.update((state) => ({ ...state, currentVerse: initialVerse, currentView: initialView }));
    if (initialVerse > 0) {
      // Defer scroll so the DOM is ready
      setTimeout(() => scrollToCurrentVerse(initialVerse), 100);
    }

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

    // On tab becomes visible OR becomes online again → reconnect
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        const code = page.url.searchParams.get("code");
        const isHost = page.url.searchParams.get("isHost") === "true";

        if (code) {
          if (isHost) startLiveReadingRoom(code);
          else joinLiveReadingRoom(code);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", handleVisibility);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
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

<SeoHead
  title={`${data.dua.title["translit"]} – ${data.dua.title[data.lang]}`}
  description={data.dua.seo_description[data.lang]}
  type="webpage" />

<svelte:window on:beforeunload={beforeUnload} />

<HowToLiveReadingDialog />

<div class="container mx-auto px-0 pt-8 sm:px-2">
  {#if $duaStore.currentView !== "presentation"}
    <DuaContent dua={data.dua} {user} />
  {/if}

  <div class="mb-8 flex justify-center" bind:this={viewTabsElement}>
    <DuaLineViews dua={data.dua} {user} />
  </div>
</div>

<AudioPlayer dua={data.dua} />
