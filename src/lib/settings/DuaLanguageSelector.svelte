<script lang="ts">
  import { getLanguageLabel, settingsStore } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n";
  import { maxFontSize, minFontSize } from "$lib/utils";
  import FontSizeAdjuster from "./FontSizeAdjuster.svelte";

  let primaryFontSize: number;
  let secondaryFontSize: number;
  let tertiaryFontSize: number;

  settingsStore.subscribe((settings) => {
    primaryFontSize = settings.primaryDuaFontSize;
    secondaryFontSize = settings.secondaryDuaFontSize;
    tertiaryFontSize = settings.tertiaryDuaFontSize;
  });

  function adjustFontSize(type: "primary" | "secondary" | "tertiary", increment: boolean) {
    settingsStore.update((settings) => {
      const currentSize = settings[`${type}DuaFontSize`];
      const newSize = increment ? Math.min(maxFontSize, currentSize + 1) : Math.max(minFontSize, currentSize - 1);
      return {
        ...settings,
        [`${type}DuaFontSize`]: newSize,
      };
    });
  }
</script>

<div class="space-y-4">
  <div>
    <p class="text-base font-medium">
      {$t("settings.dua.language.title", { index: 1 })}: Arabisch
    </p>
    <FontSizeAdjuster type="primary" fontSize={primaryFontSize} onAdjust={adjustFontSize} />
  </div>

  <div>
    <p class="text-base font-medium">
      {$t("settings.dua.language.title", { index: 2 })}: Transliteration
    </p>
    <FontSizeAdjuster type="secondary" fontSize={secondaryFontSize} onAdjust={adjustFontSize} />
  </div>

  {#if $settingsStore.systemLanguage !== "ar"}
    <div>
      <p class="text-base font-medium">
        {$t("settings.dua.language.title", { index: 3 })}: {getLanguageLabel($settingsStore.systemLanguage)}
      </p>
      <FontSizeAdjuster type="tertiary" fontSize={tertiaryFontSize} onAdjust={adjustFontSize} />
    </div>
  {/if}
</div>
