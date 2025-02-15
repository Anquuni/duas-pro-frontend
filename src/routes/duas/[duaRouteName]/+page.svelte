<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import DuaReadingView from "$lib/dua-detail/views/DuaReadingView.svelte";
  import DuaTranslationView from "$lib/dua-detail/views/DuaTranslationView.svelte";
  import { headerStore } from "$lib/header/header.store";
  import HowToLiveReadingDialog from "$lib/live-reading/HowToLiveReadingDialog.svelte";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import { joinLiveReadingRoom, leaveLiveReadingRoom } from "$lib/live-reading/live-reading.utils";
  import { t } from "$lib/translations/i18n";
  import { Book, Languages, Presentation } from "lucide-svelte";
  import { onMount } from "svelte";
  import AudioPlayer from "../../../lib/dua-detail/audio-player/AudioPlayer.svelte";
  import DuaContent from "../../../lib/dua-detail/DuaContent.svelte";
  import DuaPresentationView from "../../../lib/dua-detail/views/DuaPresentationView.svelte";

  // TODO: Rename folder of components to dua-reader

  let { data } = $props();

  let viewTabsElement: HTMLElement;

  let scrollReference = 0;
  let scrollThreshold = 75; // Schwellenwert für Header-Änderungen
  let isExpandedHeader = true;

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
      duaTitle: data.dua.title["EN"],
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

        if (scrollingUp !== isExpandedHeader) {
          isExpandedHeader = scrollingUp;
          headerStore.update((state) => ({
            ...state,
            isExpandedHeader,
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

  function setActiveTab(tab: string | undefined) {
    if (tab) {
      duaStore.update((state) => ({ ...state, currentTab: tab }));
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

<svelte:window on:beforeunload={beforeUnload} />

<HowToLiveReadingDialog />

<div class="container mx-auto px-4 pt-8">
  <DuaContent dua={data.dua} />

  <div class="mb-8 flex justify-center" bind:this={viewTabsElement}>
    <Tabs class="w-full" bind:value={$duaStore.currentView} onValueChange={setActiveTab}>
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="translation" class="flex items-center justify-center">
          <Languages class="mr-2 h-5 w-5" />
          {$t("dua.views.translation")}
        </TabsTrigger>
        <TabsTrigger value="reading" class="flex items-center justify-center">
          <Book class="mr-2 h-5 w-5" />
          {$t("dua.views.reading")}
        </TabsTrigger>
        <TabsTrigger value="presentation" class="flex items-center justify-center">
          <Presentation class="mr-2 h-5 w-5" />
          {$t("dua.views.presentation")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="translation">
        <DuaTranslationView lines={data.dua.lines} currentVerseIndex={$duaStore.currentVerse} />
      </TabsContent>
      <TabsContent value="reading">
        <DuaReadingView lines={data.dua.lines} currentVerseIndex={$duaStore.currentVerse} />
      </TabsContent>
      <TabsContent value="presentation">
        <DuaPresentationView lines={data.dua.lines} />
      </TabsContent>
    </Tabs>
  </div>
</div>

<AudioPlayer dua={data.dua} />
