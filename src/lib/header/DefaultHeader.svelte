<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Popover, PopoverTrigger } from "$lib/components/ui/popover";
  import { settingsStore } from "$lib/settings/settings.store";
  import { Github, Settings } from "lucide-svelte";
  import SettingsPopover from "../settings/SettingsPopover.svelte";
</script>

<div class="flex h-[60px] items-center justify-between px-4 py-1">
  <div class="flex items-center space-x-4">
    <a href="/{$settingsStore.systemLanguage}" class="text-xl font-bold transition-colors hover:text-primary"
      >duas.pro</a>
    <a href="/{$settingsStore.systemLanguage}/duas" class="transition-colors hover:text-primary">Duas</a>
  </div>

  <div class="flex items-center space-x-2">
    <a href="https://github.com/duas-pro/" target="_blank" rel="noopener noreferrer">
      <Button variant="ghost" size="icon">
        <Github class="h-5 w-5" />
        <span class="sr-only">GitHub</span>
      </Button>
    </a>

    <Popover>
      <PopoverTrigger asChild let:builder>
        <Button builders={[builder]} variant="ghost" size="icon">
          <Settings class="h-5 w-5" />
          <span class="sr-only">Einstellungen öffnen</span>
        </Button>
      </PopoverTrigger>

      <SettingsPopover />
    </Popover>
  </div>
</div>
