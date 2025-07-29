<script lang="ts">
  import DuaVerse from "./DuaVerse.svelte";

  let { lines, currentVerseIndex } = $props();
</script>

{#each lines as line, index}
  <DuaVerse {line} {index} {currentVerseIndex} />
{/each}
