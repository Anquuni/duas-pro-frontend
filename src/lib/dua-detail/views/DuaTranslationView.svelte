<script lang="ts">
  import { settingsStore } from "$lib/settings/settings.store";
  import DuaVerse from "./DuaVerse.svelte";

  let { duaSlug, lines, currentVerseIndex, user } = $props();
</script>

{#each lines as line, index}
    {#if lines[index]["section_title_" + $settingsStore.systemLanguage] && (index === 0 || lines[index - 1]["section_title_" + $settingsStore.systemLanguage] !== lines[index]["section_title_" + $settingsStore.systemLanguage])}
  <span
    class="rounded-lg px-4 py-2 text-center text-sm font-semibold tracking-wide
           bg-gray-100 text-gray-700
           dark:bg-muted dark:text-muted-foreground"
  >
    {lines[index]["section_title_" + $settingsStore.systemLanguage]}
  </span>
{/if}
  <DuaVerse {duaSlug} {line} {index} {currentVerseIndex} {user} />
{/each}
