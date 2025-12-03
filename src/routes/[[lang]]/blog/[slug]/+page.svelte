<script lang="ts">
  import SeoHead from "$lib/SEOHead.svelte";
  import { settingsStore } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n.js";
  import { parse } from "marked";

  let { data } = $props();

  const title = $derived(data.post.title);
  const excerpt = $derived(data.post.excerpt ?? "");
  const markdown = $derived(data.post.body_markdown ?? "");
  const cover = $derived(data.post.cover_image_url || null);
  // const tags: string[] = data.post.tags ?? ["Frage", "Islam"];
  const author = $derived(data.post.author || "duas.pro");
  const publishedAt = $derived(data.post.created_at ? new Date(data.post.created_at) : null);

  // Content: Markdown -> HTML (Fallback)
  let contentHtml = $derived(parse(markdown));

  // Lesezeit (≈200 wpm)
  const words = $derived(stripMarkdown(markdown).trim().split(/\s+/).filter(Boolean).length);
  const readingMinutes = $derived(Math.max(1, Math.round(words / 200)));

  function fmtDate(d: Date | null) {
    if (!d) return null;
    const lang = $settingsStore.systemLanguage === "de" ? "de-DE" : "en-US";
    try {
      return new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      return d.toISOString().slice(0, 10);
    }
  }

  function stripMarkdown(s: string) {
    if (!s) return "";
    return s
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]+`/g, " ")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
      .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
      .replace(/^>.*$/gm, " ")
      .replace(/^#+\s?/gm, " ")
      .replace(/[*_>-]/g, " ")
      .replace(/\s+/g, " ");
  }
</script>

<SeoHead {title} description={excerpt || title} type="article" />

<div class="px-4 py-6 sm:px-6 md:px-8">
  <div class="mx-auto max-w-3xl">
    <a href="/blog" class="text-sm text-gray-600 hover:text-primary hover:underline"> ← Zurück zu Blog-Beiträgen </a>
  </div>

  <article class="mx-auto max-w-3xl py-12 sm:py-16">
    <header class="mb-6">
      {#if data.post.topic}
        <div class="text-sm font-semibold uppercase tracking-wide text-primary">
          {$t("topic." + data.post.topic)}
        </div>
      {/if}
      <h1 class="text-4xl font-semibold leading-tight tracking-tight">{title}</h1>

      {#if excerpt}
        <p class="mt-4 text-base leading-relaxed text-gray-900 dark:text-gray-100">
          {excerpt}
        </p>
      {/if}

      <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        {#if author}
          <span class="inline-flex items-center gap-2">
            <img
              src={data.post.author_avatar_url ??
                "https://dhreftlcbkiqbsprhjqh.supabase.co/storage/v1/object/public/branding/logo.png"}
              alt={author}
              class="h-10 w-10 rounded-full object-cover shadow-md"
              loading="lazy" />
            Post by <a href="/" class="underline">{author}</a>
          </span>
        {/if}
        {#if publishedAt}
          <span class="text-gray-500">· {fmtDate(publishedAt)}</span>
        {/if}
        <span class="text-gray-500">· {readingMinutes} Min. Lesezeit</span>
      </div>

      <!-- {#if tags && tags.length}
        <div class="mt-4 flex flex-wrap gap-2">
          {#each tags as tag}
            <span class="rounded-full border px-3 py-1 text-xs text-gray-700">
              #{tag}
            </span>
          {/each}
        </div>
      {/if} -->

      {#if cover}
        <div class="mt-6 overflow-hidden rounded-2xl border">
          <img src={cover} alt="" class="h-auto w-full object-cover" loading="lazy" />
        </div>
      {/if}
    </header>

    <div class="prose prose-neutral max-w-none dark:prose-invert">
      {@html contentHtml}
    </div>
  </article>
</div>

<style>
  :global(.text-muted-foreground) {
    color: rgb(107 114 128);
  } /* Tailwind gray-500 */
</style>
