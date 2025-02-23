<script lang="ts">
  import { page } from "$app/state";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { settingsStore } from "$lib/settings/settings.store";
  import { Share2 } from "lucide-svelte";

  let { dua } = $props();

  let complete = $state(false);

  async function share() {
    const url = page.url.toString();
    const shareData: ShareData = { url, title: "duas.pro" };
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(url);
      complete = true;
      setTimeout(() => {
        complete = false;
      }, 500);
    }
  }
</script>

<div class="mb-12 text-center">
  <h2 class="arabic-font mb-2 text-4xl font-bold">{dua.title["ar"]}</h2>
  <h3 class="text-xl">{dua.title["translit"]}</h3>
  <div class="mb-6">
    {#if $settingsStore.systemLanguage !== "ar"}
      <h1 class="text-3xl">{dua.title[$settingsStore.systemLanguage]}</h1>
    {/if}
  </div>

  <div class="mb-4 flex items-center justify-center space-x-4">
    {#each dua.tags as tag}
      <Badge variant="outline">{tag}</Badge>
    {/each}
  </div>

  <p class="mb-6 text-sm text-gray-600">By {dua.narratedBy[$settingsStore.systemLanguage]}</p>

  <p class="mx-auto mb-6 max-w-2xl text-gray-700">{dua.description[$settingsStore.systemLanguage]}</p>

  <div class="flex justify-center space-x-4">
    <Button variant="outline" size="sm" on:click={share}>
      <Share2 class="mr-2 h-4 w-4" />
      {#if complete}
        Copied!
      {:else}
        Share
      {/if}
    </Button>
  </div>
</div>
