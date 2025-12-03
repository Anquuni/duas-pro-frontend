<script lang="ts">
  import { browser } from "$app/environment";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Separator } from "$lib/components/ui/separator";
  import FullscreenToggle from "$lib/settings/FullscreenToggle.svelte";
  import {
    getLanguageLabel,
    languages,
    nonTranslitLanguages,
    settingsStore,
    type LanguageCode,
  } from "$lib/settings/settings.store";
  import ThemeSelector from "$lib/settings/ThemeSelector.svelte";
  import { t } from "$lib/translations/i18n";
  import DuaLanguageSelector from "./DuaLanguageSelector.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Command from "$lib/components/ui/command";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Languages, Check } from "@lucide/svelte";
  import { page } from "$app/state";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase.config";

  const currentLanguage = $derived(
    languages.find((lang) => lang.value === $settingsStore.systemLanguage) || { rtl: false },
  );
  let langOpen = $state(false);
  const lang = $derived($settingsStore.systemLanguage);

  function setLanguage(languageCode: LanguageCode) {
    const segments = page.url.pathname.split("/").filter(Boolean);
    if (segments[1] === "blog" && segments[2]) {
      switchBlogPage(languageCode, segments);
      settingsStore.update((s) => ({ ...s, systemLanguage: languageCode }));
      langOpen = false;
      return;
    }
    if (page.params.lang) segments[0] = languageCode;
    else segments.unshift(languageCode);

    const searchParams = new URLSearchParams();
    if ($liveReadingStore.liveReadingRoomCode != null) searchParams.set("code", $liveReadingStore.liveReadingRoomCode);
    if ($liveReadingStore.isHost === true) searchParams.set("isHost", "true");

    goto("/" + segments.join("/") + "?" + searchParams.toString());
    settingsStore.update((s) => ({ ...s, systemLanguage: languageCode }));
    langOpen = false;
  }

  async function switchBlogPage(languageCode: LanguageCode, segments: string[]) {
    const fullSlug = segments[2]; // "my-slug--abc123"
    const suffix = fullSlug.split("--").pop(); // "abc123"

    // 1. Post anhand suffix finden
    const { data: post } = await supabase.from("posts").select("id").eq("slug_suffix", suffix).single();

    // 2. Übersetzung für neue Sprache holen
    const { data: translation } = await supabase
      .from("post_translations")
      .select("slug")
      .eq("post_id", post.id)
      .eq("language_code", languageCode)
      .single();

    // 3. NEUE URL bauen
    const newUrl = `/${languageCode}/blog/${translation.slug}--${suffix}`;

    // Query-Params übernehmen
    const searchParams = new URLSearchParams();
    if ($liveReadingStore.liveReadingRoomCode != null) searchParams.set("code", $liveReadingStore.liveReadingRoomCode);
    if ($liveReadingStore.isHost === true) searchParams.set("isHost", "true");

    goto(`${newUrl}?${searchParams.toString()}`);
  }
</script>

{#if browser}
  <Popover.Content class="flex flex-col overflow-hidden">
    <div class="overflow-y-auto" class:rtl={currentLanguage.rtl}>
      <div class="grid gap-4">
        <div class="space-y-2">
          <p class="text-base font-medium leading-none">
            {$t("settings.system.title")}
          </p>
        </div>
        <div class="grid gap-2">
          <Button variant="ghost" size="sm" onclick={() => (langOpen = !langOpen)} class="inline-flex">
            <Languages class="mr-1 !h-5 !w-5" />
            {getLanguageLabel(lang)}
          </Button>
          <Command.Dialog bind:open={langOpen}>
            <Command.Input placeholder="Search language..." />
            <Command.List>
              <Command.Empty>{$t("settings.dua.language.not-found")}</Command.Empty>
              {#each nonTranslitLanguages as item}
                <Command.Item onSelect={() => setLanguage(item.value)}>
                  <Check class={$settingsStore.systemLanguage === item.value ? "opacity-100" : "opacity-0"} />
                  {item.label}
                </Command.Item>
              {/each}
            </Command.List>
          </Command.Dialog>

          <ThemeSelector />

          <FullscreenToggle />

          <Separator />
        </div>

        <div class="grid gap-2">
          <DuaLanguageSelector />
        </div>
      </div>
    </div>
  </Popover.Content>
{/if}

<style>
  :global(.popover-content) {
    max-height: 70vh !important;
    overflow: hidden !important;
  }
</style>
