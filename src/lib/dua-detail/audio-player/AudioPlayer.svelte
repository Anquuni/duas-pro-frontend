<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Slider } from "$lib/components/ui/slider";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import { showNoHostToast } from "$lib/live-reading/live-reading.utils";
  import { supabase } from "$lib/supabase.config";
  import { ChevronDown, ChevronUp, Ellipsis, Pause, Play, SkipBack, SkipForward } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import type { DuaRecitation, DuaRecitationDetail } from "../../../ambient";
  import AudioSettingsPopover from "./AudioSettingsPopover.svelte";
  import LoadingSpinner from "../../LoadingSpinner.svelte";
  import { onMount, onDestroy } from "svelte";

  // Input from parent component
  let { dua } = $props();

  // Props & Data
  let audio: HTMLAudioElement | null = null;
  let audioData: DuaRecitationDetail;
  let currentTime = $state(0);
  let duration = $state(0);
  let playbackRate = $state(1.0);
  let currentReciter: string | null = $state(null);

  // lokale UI-Flags
  let isPlaying = $state(false);
  let isSettingsOpen = $state(false);
  let justClosedSettings = $state(false);
  let isHidden = $state(false);
  let isLoading = $state(false);

  const totalVerses = dua.lines.length - 1;
  const hasNoRecitations = dua.recitations.length === 0;
  const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  const reciters = dua.recitations.map((rec: DuaRecitation) => rec.reciters);
  if (reciters.length > 0) {
    currentReciter = reciters[0].full_name_tl;
  }

  duaStore.subscribe((duaSettings) => {
    seekToVerse(duaSettings.currentVerse);
  });

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Nur wenn keine Eingabe aktiv ist
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable;
      if (isTyping) return;

      e.preventDefault(); // Verhindert Scrollen
      
      switch (e.code) {
        case "Space":
          togglePlay();
          break;
        case "ArrowLeft":
          previousVerse();
          break;
        case "ArrowRight":
          nextVerse();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    onDestroy(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });


  function formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function setPlaybackRate(rate: number) {
    playbackRate = rate;
    if (audio) {
      audio.playbackRate = rate;
    }
    isSettingsOpen = false;
  }

  function resetAudio() {
    if (!audio) return;

    // 1. Event Listener entfernen
    audio.removeEventListener("timeupdate", handleTimeUpdate);
    audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    audio.removeEventListener("ended", handleEnded);

    // 2. Audio stoppen & leeren
    audio.pause();
    audio.src = "";
    audio.removeAttribute("src");
    audio.load(); // stoppt das Laden

    // 3. Referenz aufheben
    audio = null;
  }

  function handleTimeUpdate() {
    currentTime = audio!.currentTime;
    updateProgress();
  }

  function handleLoadedMetadata() {
    duration = audio!.duration;
  }

  function handleEnded() {
    isPlaying = false;
  }

  function setReciter(reciter: string) {
    if (reciter !== currentReciter) {
      currentReciter = reciter;
      if (isPlaying) {
        togglePlay();
      }
      resetAudio();
      togglePlay();
      isSettingsOpen = false;
    }
  }

  function handleSliderChange(value: number[]) {
    const newVerseIndex = value[0];
    duaStore.update((state) => ({ ...state, currentVerse: newVerseIndex }));
  }

  function updateProgress() {
    const currentTime = audio!.currentTime * 1000; // Convert to milliseconds
    for (let i = totalVerses; i >= 0; i--) {
      // Add a small offset (e.g. 250ms) so the transition to the next verse is detected slightly earlier.
      // This prevents the first part of the next verse (e.g. the first syllable) from being heard twice:
      // once as the audio naturally continues, and again when the verse index updates and the UI reacts.
      // Without this offset, the UI update lags slightly behind the actual audio playback.
      const offset = 250;
      if (currentTime + offset >= audioData.startTimes[i]) {
        // Avoid updating value if same to be able to scroll to other verses while playing
        if ($duaStore.currentVerse !== i) {
          duaStore.update((state) => ({ ...state, currentVerse: i }));
        }
        break;
      }
    }
  }

  function seekToVerse(verseIndex: number) {
    if (audioData) {
      audio!.currentTime = audioData.startTimes[verseIndex] / 1000; // Convert to seconds
    }
  }

  async function fetchAudio() {
    if (!currentReciter) return;

    isLoading = true;

    const selectedRecitation = dua.recitations.find(
      (rec: DuaRecitation) => rec.reciters?.full_name_tl === currentReciter,
    );

    if (!selectedRecitation) {
      console.error("Kein passender Reciter gefunden");
      isLoading = false;
      return;
    }

    const { data, error } = await supabase.functions.invoke("audios/" + selectedRecitation.uuid);
    isLoading = false;
    if (error) {
      console.error(
        `Error while fetching audio ${selectedRecitation.uuid} with recitator ${currentReciter} for dua ${dua.route_name}: ${error}`,
      );
    }

    audioData = data.data;
    if (data.data.audio_high_quality_url) {
      audio = new Audio(data.data.audio_high_quality_url);
      audio.playbackRate = playbackRate;
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);
    }
  }

  async function showNoAudioNotification() {
    toast.info("No audio found!", {
      description: "Upload an audio file to start playing.",
      action: {
        label: "Upload",
        onClick: () => console.info("Open upload modal"),
      },
    });
  }

  async function togglePlay() {
    if ($liveReadingStore.inLiveReadingRoom && !$liveReadingStore.isHost) {
      showNoHostToast();
      return;
    }
    if (hasNoRecitations) {
      showNoAudioNotification();
      return;
    }
    if (!audio) {
      await fetchAudio();
    }

    if (isPlaying) {
      audio?.pause();
    } else {
      seekToVerse($duaStore.currentVerse);
      audio?.play();
    }
    isPlaying = !isPlaying;
  }

  function previousVerse() {
    if ($liveReadingStore.inLiveReadingRoom && !$liveReadingStore.isHost) {
      showNoHostToast();
    } else if ($duaStore.currentVerse > 0) {
      duaStore.update((state) => ({
        ...state,
        currentVerse: state.currentVerse - 1,
      }));
    }
  }

  function nextVerse() {
    if ($liveReadingStore.inLiveReadingRoom && !$liveReadingStore.isHost) {
      showNoHostToast();
    } else if ($duaStore.currentVerse < totalVerses) {
      duaStore.update((state) => ({
        ...state,
        currentVerse: state.currentVerse + 1,
      }));
    }
  }

  function toggleHidden() {
    isHidden = !isHidden;
  }

  function getHeight(offset: number): number {
    const baseHeight = 60;
    return baseHeight + offset;
  }
</script>

<div
  class="fixed bottom-0 left-0 right-0 transition-transform duration-300"
  style:transform={isHidden ? `translateY(${getHeight(5)}px)` : "translateY(0)"}>
  <div class="audio-player relative bg-background">
    <!-- Toggle Button -->
    <button aria-label="Hide or Display Audio Player"
      class="fixed right-4 flex h-8 items-center gap-2 rounded-full bg-gray-700 bg-primary px-2 py-1 text-sm text-white shadow-md"
      style={`bottom: ${getHeight(10)}px;`}
      onclick={toggleHidden}>
      {#if isHidden}
        <ChevronUp class="h-6 w-6" />
      {:else}
        <ChevronDown class="h-6 w-6" />
      {/if}
    </button>

    <div class={`h-[${getHeight(0)}px]`}>
      <div class="px-4">
        <Slider
          onValueChange={handleSliderChange}
          value={[$duaStore.currentVerse]}
          max={totalVerses}
          step={1}
          class="w-full" />
      </div>
      <div class="flex h-full items-center justify-between px-4">
        <span class="text-sm text-neutral-600 dark:text-neutral-100">{isPlaying || currentTime > 0 ? formatTime(currentTime) : "--:--"}</span>
        <div class="flex h-full items-center space-x-2">
          <Button aria-label="Previous Verse" variant="ghost" class="h-full px-8" on:click={previousVerse}>
            <SkipBack class="h-6 w-6 py-0" />
          </Button>
          <Button aria-label="Play" variant="ghost" class="h-full px-8" on:click={togglePlay}>
            {#if isLoading}
              <LoadingSpinner size={24} />
            {:else if isPlaying}
              <Pause class="h-6 w-6" />
            {:else}
              <Play class="h-6 w-6" />
            {/if}
          </Button>
          <Button aria-label="Next Verse" variant="ghost" class="h-full px-8" on:click={nextVerse}>
            <SkipForward class="h-6 w-6" />
          </Button>
          <div class="relative h-full">
            <Button
              aria-label="Audio Settings"
              class="h-full px-8"
              variant="ghost"
              on:click={() => {
                if (justClosedSettings) {
                  // verhindere Toggle direkt nach Schließen durch Click-outside
                  return;
                }
                if (!hasNoRecitations) {
                  if (!isSettingsOpen) {
                    isSettingsOpen = true;
                  }
                } else {
                  showNoAudioNotification();
                }
              }}>
              <Ellipsis class="h-6 w-6" />
            </Button>
            {#if isSettingsOpen}
              <AudioSettingsPopover
                {playbackRate}
                {currentReciter}
                {speeds}
                {reciters}
                on:setPlaybackRate={(e) => setPlaybackRate(e.detail)}
                on:setReciter={(e) => setReciter(e.detail)}
                on:close={() => {
                  isSettingsOpen = false;
                  justClosedSettings = true;
                  setTimeout(() => {
                    justClosedSettings = false;
                  }, 200); // 200ms reichen meist
                }} />
            {/if}
          </div>
        </div>
        <span class="text-sm text-neutral-600 dark:text-neutral-100">{duration > 0 ? formatTime(duration) : "--:--"}</span>
      </div>
    </div>
  </div>
</div>
