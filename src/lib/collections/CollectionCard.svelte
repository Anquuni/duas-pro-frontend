<script lang="ts">
  import { goto } from "$app/navigation";
  import { settingsStore } from "$lib/settings/settings.store";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { cn } from "$lib/utils";
  import { LibraryBig, ChevronRight } from "@lucide/svelte";

  // Erwartete Form:
  // collection = {
  //   slug: string;
  //   image_url: string | null;
  //   title: Record<string, string | null>;
  //   description: Record<string, string | null>;
  //   dua_count: number;
  // }

  let { collection } = $props();

  const currentLang = $derived($settingsStore.systemLanguage);

  function firstNonNull(obj: Record<string, string | null> | undefined) {
    if (!obj) return null;
    for (const k of Object.keys(obj)) {
      if (obj[k]) return obj[k]!;
    }
    return null;
  }

  const title = $derived(collection.title?.[currentLang] ?? firstNonNull(collection.title) ?? "");
  const description = $derived(collection.description?.[currentLang] ?? firstNonNull(collection.description) ?? "");
  const img = $derived(collection.image_url || "/images/placeholders/collection.jpg");

  function openCollection() {
    goto(`/${currentLang}/collections/${collection.slug}`);
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openCollection();
    }
  }
</script>

<!-- Ganze Karte klickbar -->
<div
  role="button"
  tabindex="0"
  onclick={openCollection}
  onkeydown={onKey}
  class="group block transition-transform duration-500 ease-out active:scale-95"
  aria-label={title ? `Open collection ${title}` : "Open collection"}
>
  <Card class="flex h-full min-h-[50px] overflow-hidden transition-shadow hover:shadow-lg">
    <!-- Layout: Bild links, Content rechts -->
    <div class={cn(
      "flex",
      "flex-row"
    )}>
      <!-- Bild links -->
      <div class="relative w-36 shrink-0 md:w-48">
        <img
          src={img}
          alt={title}
          class="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <!-- Collections-Badge als visueller Unterschied -->
        <!-- <Badge class="absolute left-2 top-2">{collection.type}</Badge> -->
        <!-- dezenter Farbakzent -->
        <div class="absolute inset-y-0 right-0 w-1 bg-primary/70"></div>
      </div>

      <!-- Content -->
      <CardContent class="flex min-h-0 w-full flex-col justify-between p-4 md:p-5">
        <div class="pr-1">
          <h3 class="line-clamp-2 text-base font-semibold md:text-lg">
            {title}
          </h3>
          {#if description}
            <p class="mt-1 line-clamp-3 text-sm text-muted-foreground md:line-clamp-2">
              {description}
            </p>
          {/if}

          <!-- Meta: Anzahl Duas -->
          <div class="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <LibraryBig size={16} class="opacity-80" />
            <span>
              {collection.dua_count ?? 0} {collection.dua_count === 1 ? "Dua" : "Duas"}
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="mt-4 flex items-center justify-between">
          <Button variant="outline" size="sm" class="group/btn">
            <span>Open Collection</span>
            <ChevronRight size={18} class="ml-1 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </CardContent>
    </div>
  </Card>
</div>
