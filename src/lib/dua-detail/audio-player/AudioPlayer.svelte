<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Slider } from "$lib/components/ui/slider";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import { showNoHostToast } from "$lib/live-reading/live-reading.utils";
  import { supabase } from "$lib/supabase.config";
  import { ChevronDown, ChevronUp, Ellipsis, Pause, Play, SkipBack, SkipForward } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import type { Dua, DuaRecitation, DuaRecitationDetail } from "../../../ambient";
  import AudioSettingsPopover from "./AudioSettingsPopover.svelte";

  // export let dua: Dua;
  let { dua } = $props();

  let audioData: DuaRecitationDetail;
  let audio: HTMLAudioElement | null = null;
  let currentTime = $state(0);
  let duration = $state(0);
  let playbackRate = $state(1.0);
  let currentReciter: string | null = $state(null);
  let isPlaying = $state(false);
  let isSettingsOpen = $state(false);
  let isHidden = $state(false);

  const totalVerses = dua.lines.length;
  const hasNoRecitations = dua.recitations.length === 0;
  const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  const reciters = dua.recitations.map((rec: DuaRecitation) => rec.reciters);
  if (reciters.length > 0) {
    currentReciter = reciters[0].full_name_tl;
  }

  duaStore.subscribe((duaSettings) => {
    seekToVerse(duaSettings.currentVerse);
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
  }

  function setReciter(reciter: string) {
    if (reciter !== currentReciter) {
      currentReciter = reciter;
      if (isPlaying) {
        togglePlay();
      }
      audio = null;
      togglePlay();
    }
  }

  function handleSliderChange(value: number[]) {
    const newVerseIndex = value[0];
    duaStore.update((state) => ({ ...state, currentVerse: newVerseIndex }));
  }

  function updateProgress() {
    const currentTime = audio!.currentTime * 1000; // Convert to milliseconds
    for (let i = totalVerses; i >= 0; i--) {
      // Add a small offset (e.g. 200ms) so the transition to the next verse is detected slightly earlier.
      // This prevents the first part of the next verse (e.g. the first syllable) from being heard twice:
      // once as the audio naturally continues, and again when the verse index updates and the UI reacts.
      // Without this offset, the UI update lags slightly behind the actual audio playback.
      const offset = 200;
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
    const selectedRecitation = dua.recitations.find((rec: DuaRecitation) => rec.reciters?.full_name_tl === currentReciter);

    if (!selectedRecitation) {
      console.error("Kein passender Reciter gefunden");
      return;
    }

    const { data, error } = await supabase.functions.invoke("audios/" + selectedRecitation.uuid);
    audioData = data.data;
    if (data.data.audio_high_quality_url) {
      audio = new Audio(data.data.audio_high_quality_url);
      audio.playbackRate = playbackRate;
      audio.addEventListener("timeupdate", () => {
        currentTime = audio!.currentTime;
        updateProgress();
      });
      audio.addEventListener("loadedmetadata", () => {
        duration = audio!.duration;
      });
      audio.addEventListener("ended", () => {
        isPlaying = false;
      });
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
    } else if ($duaStore.currentVerse < totalVerses - 1) {
      duaStore.update((state) => ({
        ...state,
        currentVerse: state.currentVerse + 1,
      }));
    }
  }

  function toggleHidden() {
    isHidden = !isHidden;
  }
</script>

<div class="fixed bottom-0 left-0 right-0 transition-transform duration-300" class:translate-y-[65px]={isHidden}>
  <div class="audio-player relative bg-background">
    <!-- Toggle Button -->
    <button
      class="fixed bottom-[70px] right-4 flex h-8 items-center gap-2 rounded-full bg-gray-700 bg-primary px-2 py-1 text-sm text-white shadow-md"
      onclick={toggleHidden}>
      {#if isHidden}
        <ChevronUp class="h-6 w-6" />
      {:else}
        <ChevronDown class="h-6 w-6" />
      {/if}
    </button>

    <div class="h-[60px]">
      <div class="px-4">
        <Slider
          onValueChange={handleSliderChange}
          value={[$duaStore.currentVerse]}
          max={totalVerses - 1}
          step={1}
          class="w-full" />
      </div>
      <div class="flex h-full items-center justify-between px-4">
        <span class="text-sm text-gray-500">{isPlaying || currentTime > 0 ? formatTime(currentTime) : "--:--"}</span>
        <div class="flex items-center space-x-2 md:space-x-8">
          <Button variant="ghost" on:click={previousVerse}>
            <SkipBack class="h-6 w-6" />
          </Button>
          <Button variant="ghost" on:click={togglePlay}>
            {#if isPlaying}
              <Pause class="h-6 w-6" />
            {:else}
              <Play class="h-6 w-6" />
            {/if}
          </Button>
          <Button variant="ghost" on:click={nextVerse}>
            <SkipForward class="h-6 w-6" />
          </Button>
          <div class="relative">
            <Button
              variant="ghost"
              on:click={() => {
                if (!hasNoRecitations) {
                  isSettingsOpen = !isSettingsOpen;
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
                on:close={() => (isSettingsOpen = false)} />
            {/if}
          </div>
        </div>
        <span class="text-sm text-gray-500">{duration > 0 ? formatTime(duration) : "--:--"}</span>
      </div>
    </div>
  </div>
</div>
