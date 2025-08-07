<script lang="ts">
  import DuaVerse from "./DuaVerse.svelte";

  let { duaSlug, lines, currentVerseIndex, user, form } = $props();
</script>

{#each lines as line, index}
  <DuaVerse {duaSlug} {line} {index} {currentVerseIndex} {user} {form} />
{/each}
