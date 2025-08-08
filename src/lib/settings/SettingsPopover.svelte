<script lang="ts">
  import { browser } from "$app/environment";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Separator } from "$lib/components/ui/separator";
  import FullscreenToggle from "$lib/settings/FullscreenToggle.svelte";
  import { languages, settingsStore } from "$lib/settings/settings.store";
  import ThemeSelector from "$lib/settings/ThemeSelector.svelte";
  import { t } from "$lib/translations/i18n";
  import DuaLanguageSelector from "./DuaLanguageSelector.svelte";

  const currentLanguage = $derived(
    languages.find((lang) => lang.value === $settingsStore.systemLanguage) || { rtl: false },
  );
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
