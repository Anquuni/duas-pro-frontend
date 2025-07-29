<script lang="ts">
  import { page } from "$app/state";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { settingsStore } from "$lib/settings/settings.store";
  import { cn } from "$lib/utils";
  import { Share2, User } from "@lucide/svelte";

  let { dua } = $props();
  const isPopular = dua.tags.includes("popular");
  const isRecommendedToday = dua.tags.includes("daily");

  async function shareDua(id: string) {
    const url = page.url.toString() + "/duas/" + dua.route_name;
    const shareData: ShareData = { url, title: "duas.pro" };
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(url);
    } 
  }

  function handleAction(event: Event, action: () => void) {
    event.preventDefault();
    event.stopPropagation();
    action();
  }
</script>

<a href="/{$settingsStore.systemLanguage}/duas/{dua.route_name}" class="block transition-transform duration-500 ease-out active:scale-95">
  <Card class="relative overflow-hidden transition-shadow hover:shadow-lg">
    {#if isPopular || isRecommendedToday}
      <Badge class="absolute right-2 top-2 z-20">
        {isPopular ? "Popular" : "Recommended Today"}
      </Badge>
    {/if}
    <CardHeader
      class={cn(
        "relative bg-cover bg-center py-8",
        "before:absolute before:inset-0 before:z-10 before:bg-black/50 before:content-['']",
      )}
      style="background-image: url({dua.image_url});">
      <div class="relative z-20 flex items-start justify-between">
        <div>
          <CardTitle class="text-xl font-semibold text-white">{dua.title["translit"]}</CardTitle>
          {#if $settingsStore.systemLanguage !== "ar"}
            <CardDescription class="text-sm text-gray-200">{dua.title[$settingsStore.systemLanguage]}</CardDescription>
          {/if}
        </div>
        <CardTitle class="arabic-font text-right text-2xl text-white">{dua.title["ar"]}</CardTitle>
      </div>
    </CardHeader>
    <CardContent class="pt-4">
      <p class="mb-2 text-sm text-muted-foreground">
        <!-- A powerful prayer known for seeking forgiveness and protection. -->
        <!-- {dua.description[$settingsStore.systemLanguage]} -->
      </p>
      <div class="mt-2 flex items-center justify-between">
        <p class="text-xs font-semibold text-primary"></p>
        {#each dua.tags as tag}
          <p class="text-xs font-semibold text-primary">{tag}</p>
        {/each}
        {#if dua.narratedBy[$settingsStore.systemLanguage] !== null}
          <div class="flex items-center text-xs text-muted-foreground">
            <User size={14} class="mr-1" />
            <span>{dua.narratedBy[$settingsStore.systemLanguage]}</span>
          </div>
        {/if}
      </div>
    </CardContent>
    <CardFooter class="flex items-center justify-between">
      <Button variant="outline" size="sm">Read Full Dua</Button>
      <div class="flex space-x-2">
        <Button variant="ghost" size="icon" onclick={(e) => handleAction(e, () => shareDua(dua.route_name))}>
          <Share2 size={20} />
        </Button>
      </div>
    </CardFooter>
  </Card>
</a>
