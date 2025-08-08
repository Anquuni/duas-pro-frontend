<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { getLanguageValue, nonTranslitLanguages, settingsStore, type LanguageCode } from "$lib/settings/settings.store";
  import { Check, Github, Languages, Settings, User } from "@lucide/svelte";
  import SettingsPopover from "../settings/SettingsPopover.svelte";
  import logo from "$lib/assets/duas-pro-logo.svg";
  import * as Command from "$lib/components/ui/command/index.js";
  import { goto } from "$app/navigation";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import { page } from "$app/state";
  import { t } from "$lib/translations/i18n";
  import AuthDialog from "./AuthDialog.svelte";

  let { user } = $props();
  let open = $state(false);

  function setLanguage(languageCode: LanguageCode) {
    const segments = page.url.pathname.split("/").filter(Boolean);
    if (page.params.lang) {
      segments[0] = languageCode;
    } else {
      segments.unshift(languageCode);
    }

    const searchParams = new URLSearchParams();
    if ($liveReadingStore.liveReadingRoomCode != null) {
      searchParams.set("code", $liveReadingStore.liveReadingRoomCode);
    }
    if ($liveReadingStore.isHost === true) {
      searchParams.set("isHost", "true");
    }

    goto("/" + segments.join("/") + "?" + searchParams.toString());

    settingsStore.update((settings) => ({
      ...settings,
      systemLanguage: languageCode,
    }));

    open = false;
  }
</script>

<div class="flex h-[60px] items-center justify-between px-2 py-1 sm:px-4">
  <a
    href="/{$settingsStore.systemLanguage}"
    class="flex items-center space-x-2 text-xl font-bold transition-transform duration-500 ease-out active:scale-95">
    <img src={logo} alt="duas.pro logo" class="h-8 w-auto" />
    <span>duas.pro</span>
  </a>

  <div class="flex items-center space-x-2">
    <Button variant="ghost" onclick={() => (open = !open)}>
      <Languages class="!h-5 !w-5" />
      {getLanguageValue($settingsStore.systemLanguage).toUpperCase()}
    </Button>

    <Command.Dialog bind:open>
      <Command.Input placeholder="Search language..." />
      <Command.List>
        <Command.Empty>{$t("settings.dua.language.not-found")}</Command.Empty>

        {#each nonTranslitLanguages as lang}
          <Command.Item onSelect={() => setLanguage(lang.value)}>
            <Check class={$settingsStore.systemLanguage === lang.value ? "opacity-100" : "opacity-0"} />
            {lang.label}
          </Command.Item>
        {/each}
      </Command.List>
    </Command.Dialog>

    <a href="https://github.com/Anquuni/duas-pro-frontend" target="_blank" rel="noopener noreferrer">
      <Button variant="ghost" size="icon">
        <Github class="!h-5 !w-5" />
        <span class="sr-only">GitHub</span>
      </Button>
    </a>

    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" size="icon">
          <User class="!h-5 !w-8" />
          <span class="sr-only">Login</span>
        </Button>
      </Popover.Trigger>
      <AuthDialog {user} />
    </Popover.Root>

    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" size="icon">
          <Settings class="!h-5 !w-8" />
          <span class="sr-only">Open Settings</span>
        </Button>
      </Popover.Trigger>
      <SettingsPopover />
    </Popover.Root>
  </div>
</div>
