<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { settingsStore } from "$lib/settings/settings.store";
  import { Github, Settings } from "@lucide/svelte";
  import SettingsPopover from "../settings/SettingsPopover.svelte";
  import logo from "$lib/assets/duas-pro-logo.svg";
</script>

<div class="flex h-[60px] items-center justify-between px-4 py-1">
  <a
    href="/{$settingsStore.systemLanguage}"
    class="flex items-center space-x-2 text-xl font-bold transition-transform duration-500 ease-out active:scale-95">
    <img src={logo} alt="duas.pro logo" class="h-8 w-auto" />
    <span>duas.pro</span>
  </a>

  <div class="flex items-center space-x-2">
    <a href="https://github.com/Anquuni/duas-pro-frontend" target="_blank" rel="noopener noreferrer">
      <Button variant="ghost" size="icon">
        <Github class="!h-5 !w-5" />
        <span class="sr-only">GitHub</span>
      </Button>
    </a>

    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost">
          <Settings class="!h-5 !w-8" />
          <span class="sr-only">Einstellungen öffnen</span>
        </Button>
      </Popover.Trigger>
      <SettingsPopover />
    </Popover.Root>
  </div>
</div>
