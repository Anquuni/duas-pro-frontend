<script lang="ts">
  import DuaVerse from "./DuaVerse.svelte";

  let { lines, currentVerseIndex, user, supabase } = $props();
</script>

{#each lines as line, index}
  <DuaVerse {line} {index} {currentVerseIndex} {user} {supabase} />
{/each}
