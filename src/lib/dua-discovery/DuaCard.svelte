<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { settingsStore } from "$lib/settings/settings.store";
  import { cn } from "$lib/utils";
  import { Bookmark, Clock, MicVocal, Share2, User } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  let { dua } = $props();
  const isPopular = dua.tags.includes("popular");
  const isRecommendedToday = dua.tags.includes("daily");

  async function shareDua() {
    const url = page.url.toString() + "/duas/" + dua.route_name;
    const shareData: ShareData = { url, title: "duas.pro" };
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(url);
    } 
  }

  function bookmarkDua() {
    toast.info("Bookmark is not implemented yet!", {
      description: "Contribute to the project by joining the GitHub community or clicking on Contact in the Footer section",
    });
  }

  function handleAction(event: Event, action: () => void) {
    event.preventDefault();
    event.stopPropagation();
    action();
  }

  function navigate() {
    goto(`/${$settingsStore.systemLanguage}/duas/${dua.route_name}`)
  }

  const readingTime = $derived(Math.ceil(dua.word_count[$settingsStore.systemLanguage] ?? 0 / 200))
</script>

<a onclick={(e) => handleAction(e, () => navigate())} href="/{$settingsStore.systemLanguage}/duas/{dua.route_name}" class="block transition-transform duration-500 ease-out active:scale-95">
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
    <CardContent class="py-2">
      <div class="mt-2 flex flex-wrap gap-2 mb-2">
        {#each dua.tags as tag}
          <p class="text-xs font-semibold text-primary">{tag}</p>
        {/each}
      </div>

      <p class="mb-2 text-sm text-neutral-600 dark:text-neutral-100">
        {dua.description[$settingsStore.systemLanguage]}
      </p>

    <!-- Reading Time & Anzahl Rezitatoren -->
    <div class="flex items-center align-center text-xs text-neutral-600 dark:text-neutral-100 mb-2 space-x-4">
      {#if dua.word_count[$settingsStore.systemLanguage]}
        <div class="flex items-center">
          <Clock size={14} class="mr-1" />
          <span>{readingTime} Min. Lesedauer</span>
        </div>
      {/if}
        {#if dua.narrator !== null}
          <div class="flex items-center">
            <User size={14} class="mr-1" />
            <span>{dua.narrator}</span>
          </div>
        {/if}
    </div>    

    <!-- Profilbilder -->
     {#if dua.reciters.length > 0}
      <div class="flex items-center">
        <!-- Icon -->
        <MicVocal size={20} class="mr-1 text-muted-foreground" />

        <!-- überlappende Bilder -->
        <div class="flex -space-x-2">
          {#each dua.reciters as reciter}
            <img
              src={reciter.profile_image_url}
              alt={reciter.full_name_tl}
              title={reciter.full_name_tl}
              class="w-7 h-7 rounded-full border-2 border-white object-cover"
            />
          {/each}
        </div>
      </div>
     {/if}

    </CardContent>
    <CardFooter class="flex items-center justify-between pb-2">
      <Button variant="outline" size="sm">Read Full Dua</Button>
      <div class="flex space-x-2">
        <Button variant="ghost" size="icon" onclick={(e) => handleAction(e, () => shareDua())}>
          <Share2 size={20} />
        </Button>
        <Button variant="ghost" size="icon" onclick={(e) => handleAction(e, () => bookmarkDua())}>
          <Bookmark size={20} />
        </Button>
      </div>
    </CardFooter>
  </Card>
</a>
