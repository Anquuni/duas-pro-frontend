<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "$lib/components/ui/command";
  import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
  import { getLanguageLabel, languages, type LanguageCode } from "$lib/settings/settings.store";
  import { t } from "$lib/translations/i18n";
  import { Check, ChevronsUpDown } from "lucide-svelte";

  export let isSystemLanguage: boolean = false;
  export let languageCode: LanguageCode;
  export let onSelect: (languageCode: LanguageCode) => void;

  let open = false;
  const filteredLanguages = isSystemLanguage ? languages.filter((l) => l.value !== "translit") : languages;

  function handleSelect(lang: LanguageCode) {
    onSelect(lang);
    open = false;
  }
</script>

<Popover bind:open>
  <PopoverTrigger asChild let:builder>
    <Button variant="outline" role="combobox" aria-expanded={open} class="w-full justify-between" builders={[builder]}>
      {getLanguageLabel(languageCode)}
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent class="w-full p-0">
    <Command>
      <CommandInput placeholder="Search language..." />
      <CommandEmpty>{$t("settings.dua.language.not-found")}</CommandEmpty>
      <CommandGroup>
        {#each filteredLanguages as lang}
          <CommandItem onSelect={() => handleSelect(lang.value)}>
            <Check class={languageCode === lang.value ? "opacity-100" : "opacity-0"} />
            {lang.label}
          </CommandItem>
        {/each}
      </CommandGroup>
    </Command>
  </PopoverContent>
</Popover>
