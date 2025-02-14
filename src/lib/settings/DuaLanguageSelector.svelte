<script lang="ts">
  import { settingsStore, type LanguageCode } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n";
  import { maxFontSize, minFontSize } from "$lib/utils";
  import FontSizeAdjuster from "./FontSizeAdjuster.svelte";
  import LanguageSelector from "./LanguageSelector.svelte";

  let primaryLanguage: LanguageCode;
  let secondaryLanguage: LanguageCode;
  let tertiaryLanguage: LanguageCode;
  let primaryFontSize: number;
  let secondaryFontSize: number;
  let tertiaryFontSize: number;

  settingsStore.subscribe((settings) => {
    primaryLanguage = settings.primaryDuaLanguage;
    secondaryLanguage = settings.secondaryDuaLanguage;
    tertiaryLanguage = settings.tertiaryDuaLanguage;
    primaryFontSize = settings.primaryDuaFontSize;
    secondaryFontSize = settings.secondaryDuaFontSize;
    tertiaryFontSize = settings.tertiaryDuaFontSize;
  });

  function setLanguage(type: "primary" | "secondary" | "tertiary", languageCode: LanguageCode) {
    settingsStore.update((settings) => ({
      ...settings,
      [`${type}DuaLanguage`]: languageCode,
    }));
  }

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
    <h5 class="font-medium">
      {$t("settings.dua.language.title", { index: 1 })}
    </h5>
    <p class="mb-2 text-xs text-gray-500">{$t("settings.dua.language.note")}</p>
    <LanguageSelector type="primary" languageCode={primaryLanguage} onSelect={setLanguage} />
    <div class="mt-2">
      <FontSizeAdjuster type="primary" fontSize={primaryFontSize} onAdjust={adjustFontSize} />
    </div>
  </div>

  <div>
    <h5 class="mb-2 font-medium">
      {$t("settings.dua.language.title", { index: 2 })}
    </h5>
    <LanguageSelector type="secondary" languageCode={secondaryLanguage} onSelect={setLanguage} />
    <div class="mt-2">
      <FontSizeAdjuster type="secondary" fontSize={secondaryFontSize} onAdjust={adjustFontSize} />
    </div>
  </div>

  <div>
    <h5 class="mb-2 font-medium">
      {$t("settings.dua.language.title", { index: 3 })}
    </h5>
    <LanguageSelector type="tertiary" languageCode={tertiaryLanguage} onSelect={setLanguage} />
    <div class="mt-2">
      <FontSizeAdjuster type="tertiary" fontSize={tertiaryFontSize} onAdjust={adjustFontSize} />
    </div>
  </div>
</div>
