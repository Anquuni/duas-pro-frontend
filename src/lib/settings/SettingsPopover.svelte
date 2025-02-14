<script lang="ts">
  import { browser } from "$app/environment";
  import { PopoverContent } from "$lib/components/ui/popover";
  import { Separator } from "$lib/components/ui/separator";
  import ThemeSelector from "$lib/settings/ThemeSelector.svelte";
  import FullscreenToggle from "$lib/settings/FullscreenToggle.svelte";
  import DuaLanguageSelector from "./DuaLanguageSelector.svelte";
  import { type LanguageCode, settingsStore } from "$lib/settings/settings.store";
  import LanguageSelector from "./LanguageSelector.svelte";
  import { t } from "$lib/translations/i18n";

  let systemLanguage: LanguageCode;

  settingsStore.subscribe((settings) => {
    systemLanguage = settings.systemLanguage;
  });

  function setLanguage(type: "primary" | "secondary" | "tertiary", languageCode: LanguageCode) {
    settingsStore.update((settings) => ({
      ...settings,
      systemLanguage: languageCode,
    }));
  }
</script>

{#if browser}
  <PopoverContent class="flex max-h-[70vh] w-80 flex-col overflow-hidden">
    <div class="overflow-y-auto">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">
            {$t("settings.system.title")}
          </h4>
        </div>
        <div class="grid gap-2">
          <ThemeSelector />

          <LanguageSelector
            isSystemLanguage={true}
            type="primary"
            languageCode={systemLanguage}
            onSelect={setLanguage} />

          <FullscreenToggle />

          <Separator class="my-2" />
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
