<script lang="ts">
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Sun, Moon } from "lucide-svelte";
  import { settingsStore, stringToTheme, type Theme } from "$lib/settings/settings.store";
  import { onMount } from "svelte";
  import { t } from "$lib/translations/i18n";

  let theme: Theme;

  function setTheme(newTheme: Theme) {
    settingsStore.update((settings) => ({
      ...settings,
      theme: newTheme,
    }));
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  }

  onMount(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    settingsStore.update((settings) => ({
      ...settings,
      theme: settings.theme || (prefersDark ? "dark" : "light"),
    }));

    // Listener für Änderungen der Systempräferenz
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      settingsStore.update((settings) => {
        if (!settings.theme) {
          return {
            ...settings,
            theme: e.matches ? "dark" : "light",
          };
        }
        return settings;
      });
    });
  });

  settingsStore.subscribe((settings) => {
    theme = settings.theme;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  });
</script>

<Tabs
  value={theme}
  onValueChange={(v) => {
    if (v) {
      setTheme(stringToTheme(v));
    }
  }}>
  <TabsList class="grid w-full grid-cols-2">
    <TabsTrigger class="flex-1" value="light">
      <Sun class="mr-2 h-4 w-4" />
      {$t("settings.system.theme.light")}
    </TabsTrigger>
    <TabsTrigger class="flex-1" value="dark">
      <Moon class="mr-2 h-4 w-4" />
      {$t("settings.system.theme.dark")}
    </TabsTrigger>
  </TabsList>
</Tabs>
