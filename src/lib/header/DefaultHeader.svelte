<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Popover from "$lib/components/ui/popover";
  import * as Sheet from "$lib/components/ui/sheet";
  import { settingsStore } from "$lib/settings/settings.store";
  import SettingsPopover from "../settings/SettingsPopover.svelte";
  import AuthDialog from "./AuthDialog.svelte";
  import logo from "$lib/assets/duas-pro-logo.svg";
  import { Menu, Settings, User } from "@lucide/svelte";
  import { page } from "$app/state";

  let { user } = $props();
  let open = $state(false);

  const base = $derived(`/${$settingsStore.systemLanguage}`);

  type NavItem = { label: string; slug: string; exact?: boolean };

  const navItems: NavItem[] = [
    { label: "Bittgebete", slug: "duas" },
    { label: "Sammlungen", slug: "collections" },
    { label: "Blog", slug: "blog" },
    // { label: "Unterstützer", slug: "supporters" },
    // { label: "Shop",         slug: "shop" },
    // { label: "Über uns",     slug: "about" }
  ];

  function hrefOf(item: NavItem) {
    return `${base}/${item.slug}`;
  }

  // exact=false: auch Unterseiten markieren (z. B. /de/collections/ramadan → Collections aktiv)
  function isActive(href: string, exact = false) {
    const current = page.url.pathname.replace(/\/+$/, ""); // ohne trailing slash
    const target = href.replace(/\/+$/, "");
    if (exact) return current === target;
    return current === target || current.startsWith(target + "/");
  }

  function ariaCurrent(href: string, exact = false) {
    return isActive(href, exact) ? "page" : undefined;
  }
</script>

<div class="flex h-[60px] items-center justify-between px-2 py-1 sm:px-4">
  <!-- Links: Menu (mobile) + Logo -->
  <div class="flex items-center gap-3">
    <!-- Mobile: Sheet Trigger (nur < md) -->
    <div class="md:hidden">
      <Sheet.Root bind:open>
        <Sheet.Trigger>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu class="!h-6 !w-6" />
          </Button>
        </Sheet.Trigger>

        <Sheet.Content side="left" class="w-[86%] max-w-sm">
          <Sheet.Header>
            <Sheet.Title class="text-base font-semibold">Navigation</Sheet.Title>
          </Sheet.Header>

          <nav class="mt-4 flex flex-col gap-1">
            {#each navItems as item}
              {#key item.slug}
                <a
                  href={hrefOf(item)}
                  data-active={isActive(hrefOf(item), item.exact)}
                  aria-current={ariaCurrent(hrefOf(item), item.exact)}
                  onclick={() => (open = false)}
                  class="rounded px-3 py-2 text-xl hover:bg-muted data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                  {item.label}
                </a>
              {/key}
            {/each}
          </nav>
        </Sheet.Content>
      </Sheet.Root>
    </div>

    <!-- Brand (Logo + Text) -->
    <a
      href={base}
      class="flex items-center gap-2 text-xl font-bold transition-transform duration-500 ease-out active:scale-95">
      <img src={logo} alt="duas.pro logo" class="h-8 w-auto" />
      <span>duas.pro</span>
    </a>
  </div>

  <!-- Desktop Nav (ab md:) -->
  <nav class="hidden items-center gap-6 md:flex">
    {#each navItems as item}
      {#key item.slug}
        <a
          href={hrefOf(item)}
          data-active={isActive(hrefOf(item), item.exact)}
          aria-current={ariaCurrent(hrefOf(item), item.exact)}
          class="text-sm font-medium hover:underline data-[active=true]:font-semibold data-[active=true]:underline">
          {item.label}
        </a>
      {/key}
    {/each}
  </nav>

  <!-- Rechts: Aktionen -->
  <div class="flex items-center gap-1 md:gap-2">
    <!-- Login -->
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" size="icon">
          {#if user}<User class="!h-5 !w-5" />{:else}<span class="text-sm">Login</span>{/if}
          <span class="sr-only">Login</span>
        </Button>
      </Popover.Trigger>
      <AuthDialog {user} />
    </Popover.Root>

    <!-- Settings -->
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" size="icon">
          <Settings class="!h-5 !w-5" />
          <span class="sr-only">Open Settings</span>
        </Button>
      </Popover.Trigger>
      <SettingsPopover />
    </Popover.Root>
  </div>
</div>
