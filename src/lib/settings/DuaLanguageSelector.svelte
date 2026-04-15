<script lang="ts">
  import { getLanguageLabel, languages, settingsStore } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n";
  import FontSizeAdjuster from "./FontSizeAdjuster.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import * as Command from "$lib/components/ui/command";
  import { Button } from "$lib/components/ui/button";
  import { Languages } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  let primaryFontSize: number;
  let secondaryFontSize: number;
  let tertiaryFontSize: number;
  let secondTranslationFontSize: number;

  settingsStore.subscribe((settings) => {
    primaryFontSize = settings.primaryDuaFontSize;
    secondaryFontSize = settings.secondaryDuaFontSize;
    tertiaryFontSize = settings.tertiaryDuaFontSize;
    secondTranslationFontSize = settings.secondTranslationDuaFontSize;
  });

  function changeFontSize(type: "primary" | "secondary" | "tertiary" | "secondTranslation", newFontSize: number) {
    settingsStore.update((settings) => {
      return {
        ...settings,
        [`${type}DuaFontSize`]: newFontSize,
      };
    });
  }

  let secondLangOpen = $state(false);

  const secondTranslationOptions = $derived(
    languages.filter(
      (l) =>
        l.value !== "ar" &&
        l.value !== "translit" &&
        l.value !== $settingsStore.systemLanguage,
    ),
  );

  function setSecondTranslationLanguage(code: string | null) {
    settingsStore.update((s) => ({ ...s, secondTranslationLanguage: code }));

    const newUrl = new URL(page.url.toString());
    if (code) {
      newUrl.searchParams.set("lang2", code);
    } else {
      newUrl.searchParams.delete("lang2");
    }
    goto(newUrl.toString(), { replaceState: true, noScroll: true, keepFocus: true });

    secondLangOpen = false;
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

    <Separator />
  {/if}

  <div class="flex justify-between items-center">
    <p class="flex-1 px-2 text-base font-medium">
      {$t("settings.dua.second-translation")}
    </p>
    {#if $settingsStore.secondTranslationLanguage}
      <p class="text-end text-base font-medium">
        {secondTranslationFontSize}
      </p>
    {/if}
  </div>
  <Button
    variant="ghost"
    size="sm"
    onclick={() => (secondLangOpen = !secondLangOpen)}
    class="inline-flex w-full justify-start"
  >
    <Languages class="mr-1 !h-5 !w-5" />
    {$settingsStore.secondTranslationLanguage
      ? getLanguageLabel($settingsStore.secondTranslationLanguage)
      : $t("settings.dua.second-translation.none")}
  </Button>
  <Command.Dialog bind:open={secondLangOpen}>
    <Command.List>
      <Command.Empty>{$t("settings.dua.language.not-found")}</Command.Empty>
      <Command.Item onSelect={() => setSecondTranslationLanguage(null)}>
        {$t("settings.dua.second-translation.none")}
      </Command.Item>
      {#each secondTranslationOptions as item}
        <Command.Item onSelect={() => setSecondTranslationLanguage(item.value)}>
          {item.label}
        </Command.Item>
      {/each}
    </Command.List>
  </Command.Dialog>

  {#if $settingsStore.secondTranslationLanguage}
    <FontSizeAdjuster type="secondTranslation" fontSize={secondTranslationFontSize} onChange={changeFontSize} />
  {/if}
</div>
