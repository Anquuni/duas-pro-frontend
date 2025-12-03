<script lang="ts">
  import { goto } from "$app/navigation";
  import { settingsStore } from "$lib/settings/settings.store";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { ChevronRight } from "@lucide/svelte";
  import { t } from "$lib/translations/i18n";

  // Erwartete Form:
  // post = {
  //   slug: string;
  //   cover_image_url: string | null;
  //   title: string;
  //   excerpt: string;
  //   topic?: string; // "Thema"
  // }
  let { post } = $props();

  const currentLang = $derived($settingsStore.systemLanguage);
  const img = $derived(post.cover_image_url || "/images/placeholders/post.jpg");

  function openPost() {
    goto(`/${currentLang}/blog/${post.slug}--${post.slug_suffix}`);
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPost();
    }
  }
</script>

<!-- Ganze Karte klickbar -->
<div
  role="button"
  tabindex="0"
  onclick={openPost}
  onkeydown={onKey}
  class="group block transition-transform duration-500 ease-out active:scale-95"
  aria-label={post.title ? `Open post ${post.title}` : "Open post"}>
  <Card class="h-full min-h-[260px] overflow-hidden transition-shadow hover:shadow-lg">
    <div class="grid h-full grid-cols-1 md:grid-cols-2">
      <!-- Bild -->
      <div class="relative min-h-[200px] md:min-h-full">
        <img src={img} alt={post.title} class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div class="absolute inset-y-0 right-0 w-1 bg-primary/70"></div>
      </div>

      <!-- Inhalt -->
      <CardContent class="flex flex-col justify-between p-6 md:p-8">
        <div>
          {#if post.topic}
            <div class="text-sm font-semibold uppercase tracking-wide text-primary">
              {$t("topic." + post.topic)}
            </div>
          {/if}
          <h3 class="mt-3 line-clamp-2 text-xl font-semibold">
            {post.title}
          </h3>
          {#if post.excerpt}
            <p class="mt-4 line-clamp-4 text-base leading-relaxed">
              {post.excerpt}
            </p>
          {/if}
        </div>

        <div class="mt-6">
          <Button size="sm" class="group/btn">
            <span>Lesen</span>
            <ChevronRight size={18} class="ml-1 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </CardContent>
    </div>
  </Card>
</div>
