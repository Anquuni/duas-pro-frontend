<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { PopoverContent } from "$lib/components/ui/popover";
  import { Separator } from "$lib/components/ui/separator";
  import FullscreenToggle from "$lib/settings/FullscreenToggle.svelte";
  import { type LanguageCode, languages, settingsStore } from "$lib/settings/settings.store";
  import ThemeSelector from "$lib/settings/ThemeSelector.svelte";
  import { t } from "$lib/translations/i18n";
  import DuaLanguageSelector from "./DuaLanguageSelector.svelte";
  import LanguageSelector from "./LanguageSelector.svelte";

  let systemLanguage: LanguageCode;

  settingsStore.subscribe((settings) => {
    systemLanguage = settings.systemLanguage;
  });

  function setLanguage(languageCode: LanguageCode) {
    const segments = page.url.pathname.split("/").filter(Boolean);
    if (page.params.lang) {
      segments[0] = languageCode;
    } else {
      segments.unshift(languageCode);
    }
    goto("/" + segments.join("/"));

    settingsStore.update((settings) => ({
      ...settings,
      systemLanguage: languageCode,
    }));
  }

  const currentLanguage = $derived(
    languages.find((lang) => lang.value === $settingsStore.systemLanguage) || { rtl: false },
  );
</script>

{#if browser}
  <PopoverContent class="flex max-h-[70vh] w-80 flex-col overflow-hidden">
    <div class="overflow-y-auto" class:rtl={currentLanguage.rtl}>
      <div class="grid gap-4">
        <div class="space-y-2">
          <p class="text-base font-medium leading-none">
            {$t("settings.system.title")}
          </p>
        </div>
        <div class="grid gap-2">
          <ThemeSelector />

          <LanguageSelector languageCode={systemLanguage} onSelect={setLanguage} />
          <p class="text-xs text-gray-500">{$t("settings.dua.language.note")}</p>

          <FullscreenToggle />

          <Separator class="" />
        </div>

        <div class="grid gap-2">
          <DuaLanguageSelector />
        </div>
      </div>
    </div>
  </PopoverContent>
{/if}

<style>
  :global(.popover-content) {
    max-height: 70vh !important;
    overflow: hidden !important;
  }
</style>
