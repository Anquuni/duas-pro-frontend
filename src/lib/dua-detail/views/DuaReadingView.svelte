<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { settingsStore } from "$lib/settings/settings.store";
  import type { DuaLine } from "../../../ambient";

  export let lines: DuaLine[];
  export let currentVerseIndex: number;
</script>

<div class="flex justify-center">
  <Card class="w-full">
    <CardContent class="p-6">
      <div class="text-xl leading-loose">
        {#each lines as line, index}
          {#if line.begin_of_section && index !== 0}
            <div class="my-4"></div>
          {/if}
          <span
            id="verse-{index}"
            class="transition-colors duration-300
            {index === currentVerseIndex ? 'bg-secondary/50 py-2 rounded' : ''}
            {line.type === "INSTRUCTION" ? 'italic' : ''}"
            class:primary-dua-font-size={$settingsStore.systemLanguage === "ar"}
            class:tertiary-dua-font-size={$settingsStore.systemLanguage !== "ar"}
            class:arabic-font={$settingsStore.systemLanguage === "ar"}>
            {line[$settingsStore.systemLanguage]}
          </span>
        {/each}
      </div>
    </CardContent>
  </Card>
</div>
