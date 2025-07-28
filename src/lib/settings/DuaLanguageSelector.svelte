<script lang="ts">
  import { getLanguageLabel, settingsStore } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n";
  import FontSizeAdjuster from "./FontSizeAdjuster.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import { Switch } from "$lib/components/ui/switch/index.js";

  let primaryFontSize: number;
  let secondaryFontSize: number;
  let tertiaryFontSize: number;

  settingsStore.subscribe((settings) => {
    primaryFontSize = settings.primaryDuaFontSize;
    secondaryFontSize = settings.secondaryDuaFontSize;
    tertiaryFontSize = settings.tertiaryDuaFontSize;
  });

  function changeFontSize(type: "primary" | "secondary" | "tertiary", newFontSize: number) {
    settingsStore.update((settings) => {
      return {
        ...settings,
        [`${type}DuaFontSize`]: newFontSize,
      };
    });
  }
</script>

<div class="space-y-4 mr-2">
  <div class="flex justify-between">
    <p class="flex-1 px-2 text-base font-medium">
      {$t("settings.dua.arabic")}
    </p>
    <p class="text-end text-base font-medium">
      {primaryFontSize}
    </p>
  </div>
  <FontSizeAdjuster type="primary" fontSize={primaryFontSize} onChange={changeFontSize} />

  <Separator />

  <div class="flex justify-between">
    <Switch bind:checked={$settingsStore.showTranslit} />
    <p class="flex-1 px-2 text-base font-medium">
      {$t("settings.dua.transliteration")}
    </p>
    <p class="text-end text-base font-medium">
      {secondaryFontSize}
    </p>
  </div>
  <FontSizeAdjuster type="secondary" fontSize={secondaryFontSize} onChange={changeFontSize} />

  <Separator />

  {#if $settingsStore.systemLanguage !== "ar"}
    <div class="flex justify-between">
      <p class="flex-1 px-2 text-base font-medium">
        {getLanguageLabel($settingsStore.systemLanguage)}
      </p>
      <p class="text-end text-base font-medium">
        {tertiaryFontSize}
      </p>
    </div>
    <FontSizeAdjuster type="tertiary" fontSize={tertiaryFontSize} onChange={changeFontSize} />
  {/if}
</div>
