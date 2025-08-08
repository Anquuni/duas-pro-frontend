<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { duaTypes, narrators } from "$lib/types/dua.model";
  import { Button } from "$lib/components/ui/button";
  import { t } from "$lib/translations/i18n";
  import { goto } from "$app/navigation";
  import { settingsStore } from "$lib/settings/settings.store";
  import { page } from "$app/state";

  let { filterPanelOpen = $bindable() } = $props();

  // TODO: Add Sheet or Drawer component to filter duas
  //   by book (Mafatih-ul-Jinan, Sahifa-Sadschadiyya, ...),
  //   by type (Dua, Ziyarat, Muanajat, ...),
  //   by collection (Ramadan, Imam Mahdi)
  //   by recommended time (today, weekly, monthly, yearly)
  //   by narrator
  //   if has audio or not
  //   by recitator
  //   by reading time

  let selectedTypes = $derived(page.url.searchParams.getAll("types"));
  let isTypeChecked = $derived((type: string) => selectedTypes.includes(type));

  function toggleType(type: string, checked: boolean) {
    if (checked) {
      if (!selectedTypes.includes(type)) {
        selectedTypes.push(type);
      }
    } else {
      selectedTypes = selectedTypes.filter((t) => t !== type);
    }
  }

  function applyFilters() {
    filterPanelOpen = false;
    const size = Number(page.url.searchParams.get("size") ?? 20);
    let url = `/${$settingsStore.systemLanguage}/duas?page=${1}&size=${size}`;
    if (selectedTypes) {
      url += `&types=${selectedTypes}`;
    }
    goto(url);
  }
</script>

<div class="flex h-full w-full flex-col">
  <div class="flex-none border-b p-6 text-left">
    <h2 class="text-center text-lg font-semibold">Filter</h2>
  </div>
  <div class="flex-1 overflow-y-auto p-6">
    <!-- 🧭 Typ-Filter -->
    <div class="mb-6 space-y-2">
      <div class="text-sm font-medium">Typ</div>
      <div class="flex flex-wrap gap-2">
        {#each duaTypes as type}
          <label class="flex cursor-pointer items-center gap-2 rounded border px-2 py-1">
            <Checkbox value={type} checked={isTypeChecked(type)} onCheckedChange={(checked) => toggleType(type, checked)} />
            <span>{$t("type." + type)}</span>
          </label>
        {/each}
      </div>
    </div>

    <!-- Narrator-Filter -->
    <!-- <div class="mb-6 space-y-2">
      <div class="text-sm font-medium">Narrator</div>
      <div class="flex flex-wrap gap-2">
        {#each narrators as narrator}
          <label class="flex cursor-pointer items-center gap-2 rounded border px-2 py-1">
            <Checkbox value={narrator} />
            <span>{narrator}</span>
          </label>
        {/each}
      </div>
    </div> -->
  </div>

  <!-- TODO: Add here more filters -->

  <Button class="flex-none rounded-none p-6" onclick={applyFilters}>Anwenden</Button>
</div>
