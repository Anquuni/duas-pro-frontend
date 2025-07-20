<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { getLanguageLabel, nonTranslitLanguages, type LanguageCode } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n";
  import { Check, ChevronsUpDown } from "@lucide/svelte";

  export let languageCode: LanguageCode;
  export let onSelect: (languageCode: LanguageCode) => void;

  let open = false;

  function handleSelect(lang: LanguageCode) {
    onSelect(lang);
    open = false;
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    <Button variant="outline" aria-expanded={open} role="combobox" class="w-full justify-between">
      {getLanguageLabel(languageCode)}
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content>
    <Command.Root>
      <Command.Input placeholder="Search language..." />
      <Command.List>
        <Command.Empty>{$t("settings.dua.language.not-found")}</Command.Empty>
        <Command.Group>
          {#each nonTranslitLanguages as lang}
            <Command.Item onSelect={() => handleSelect(lang.value)}>
              <Check class={languageCode === lang.value ? "opacity-100" : "opacity-0"} />
              {lang.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
