<script lang="ts">
  import { t } from "$lib/translations/i18n";
  import { Toggle } from "$lib/components/ui/toggle";
  import { Expand, Shrink } from "lucide-svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const isFullscreen = writable(false);

  onMount(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  });

  // Listener für Änderungen des Fullscreen-Status
  function handleFullscreenChange() {
    isFullscreen.set(!!document.fullscreenElement);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          isFullscreen.set(true);
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          isFullscreen.set(false);
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
  }
</script>

<Toggle aria-label="Toggle fullscreen" pressed={$isFullscreen} onPressedChange={toggleFullscreen}>
  {#if $isFullscreen}
    <Shrink class="mr-2 h-4 w-4" />
  {:else}
    <Expand class="mr-2 h-4 w-4" />
  {/if}
  {$t("settings.system.fullscreen")}
</Toggle>
