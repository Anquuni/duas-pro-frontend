<script lang="ts">
  import type { DuaLine } from "../../../ambient";
  import DuaVerse from "./DuaVerse.svelte";

  export let lines: DuaLine[];
  export let currentVerseIndex;
</script>

<div class="">
  {#each lines as line, index}
    <DuaVerse {line} {index} {currentVerseIndex} />
  {/each}
</div>
