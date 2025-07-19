<script lang="ts">
  import { languages, settingsStore } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n";

  let { dua } = $props();
</script>

<div class="text-center">
  <h2 class="arabic-font mb-2 text-4xl font-bold">{dua.title["ar"]}</h2>
  <h1 class="mb-2 text-4xl">{dua.title["translit"]}</h1>
  {#if $settingsStore.systemLanguage !== "ar"}
    <h2 class="mb-2 text-xl">{dua.title[$settingsStore.systemLanguage]}</h2>
  {/if}

  <div class="mb-6">
    {#if dua.narratedBy[$settingsStore.systemLanguage]}
      <p class="text-sm text-gray-600">{@html $t("dua.by", { narrator: dua.narratedBy[$settingsStore.systemLanguage]})}</p>
    {/if}
  </div>
</div>
