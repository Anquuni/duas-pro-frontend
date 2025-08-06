<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { settingsStore } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n";
  import { Badge } from "$lib/components/ui/badge";
  import { Bookmark, Share2 } from "@lucide/svelte";
  import { page } from "$app/state";
  import { toast } from "svelte-sonner";

  let { dua } = $props();

  async function share() {
    const url = page.url.toString();
    const shareData: ShareData = { url, title: "duas.pro" };
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  function bookmarkDua() {
    toast.info("Bookmark is not implemented yet!", {
      description:
        "Contribute to the project by joining the GitHub community or clicking on Contact in the Footer section",
    });
  }
</script>

<div class="mb-6 text-center">
  <h2 class="arabic-font mb-2 text-4xl font-bold">{dua.title["ar"]}</h2>
  <h1 class="mb-2 text-4xl">{dua.title["translit"]}</h1>
  {#if $settingsStore.systemLanguage !== "ar"}
    <h2 class="mb-4 text-xl">{dua.title[$settingsStore.systemLanguage]}</h2>
  {/if}

  {#if dua.tags.length > 0}
    <div class="mb-4 flex flex-wrap justify-center gap-2">
      {#each dua.tags as tag}
        <Badge variant="outline">{tag}</Badge>
      {/each}
    </div>
  {/if}

  <div class="mb-4">
    {#if dua.narrator}
      <p class="text-sm text-neutral-600 dark:text-neutral-100">
        {@html $t("dua.by", { narrator: $t("narrator." + dua.narrator) })}
      </p>
    {/if}
  </div>

  <p class="mb-4 max-w-2xl px-2 text-neutral-600 dark:text-neutral-100">
    {dua.description[$settingsStore.systemLanguage]}
  </p>

  <div class="flex justify-center space-x-4">
    <Button variant="outline" size="sm" onclick={share}>
      <Share2 size={20} />
    </Button>
    <Button variant="outline" size="icon" onclick={bookmarkDua}>
      <Bookmark size={20} />
    </Button>
  </div>
</div>
