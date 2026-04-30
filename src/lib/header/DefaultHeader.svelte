<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Popover from "$lib/components/ui/popover";
  import * as Sheet from "$lib/components/ui/sheet";
  import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
  } from "$lib/components/ui/navigation-menu";
  import { settingsStore } from "$lib/settings/settings.store";
  import SettingsPopover from "../settings/SettingsPopover.svelte";
  import AuthDialog from "./AuthDialog.svelte";
  import logo from "$lib/assets/duas-pro-logo.svg";
  import { ChevronDown, Menu, Settings, User } from "@lucide/svelte";
  import { page } from "$app/state";
  import { t } from "$lib/translations/i18n";

  let { user } = $props();
  let open = $state(false);
  let expandedItem = $state<string | null>(null);

  $effect(() => {
    const active = navItems.find(item =>
      item.subitems?.some(sub => isActive(hrefOf(sub.slug)))
    );
    if (active) expandedItem = active.label;
  });

  function toggleMobileItem(label: string) {
    expandedItem = expandedItem === label ? null : label;
  }

  const base = $derived(`/${$settingsStore.systemLanguage}`);

  type NavSubItem = { label: string; description: string; slug: string };
  type NavItem = { label: string; slug: string; exact?: boolean; subitems?: NavSubItem[] };

  const navItems: NavItem[] = $derived([
    // {
    //   label: "Startseite",
    //   slug: "",
    //   subitems: [],
    // },
    {
      label: "Kategorien", // $t("nav.duas")
      slug: "duas",
      subitems: [
        { label: "Dua", description: "Persönliche Bittgebete, mit denen man sich direkt an Allah wendet.", slug: "duas" },
        { label: "Ziyarat", description: "Gebete und Audienzen beim Besuch heiliger Persönlichkeiten oder ihrer Grabstätten.", slug: "ziyarat" },
      ],
    },
    {
      label: "Bücher",
      slug: "collections",
      subitems: [
        { label: "Sahifa Sadschadiyya", description: "Berühmte Sammlung von 54 Bittgebeten von Imam Zayn al-Abidin.", slug: "sahifa-sajjadia" },
        // { label: "Mafatihul-Jinan", description: "Umfangreiche Sammlung von Duas und Ziyarat, zusammengestellt von Scheich Abbas Qummi.", slug: "mafatih-ul-jinan" },
      ],
    },
    // {
    //   label: $t("nav.collections"),
    //   slug: "collections",
    //   subitems: [
    //     { label: "Monat Ramadan", description: "", slug: "collections" },
    //     { label: "Imam Mahdi", description: "", slug: "collections" },
    //   ],
    // },
    // {
    //   label: "Shop",
    //   slug: "collections",
    //   subitems: [],
    // },
  ]);

  function hrefOf(slug: string) {
    return `${base}/${slug}`;
  }

  function isActive(href: string, exact = false) {
    const current = page.url.pathname.replace(/\/+$/, "");
    const target = href.replace(/\/+$/, "");
    if (exact) return current === target;
    return current === target || current.startsWith(target + "/");
  }

  function ariaCurrent(href: string, exact = false) {
    return isActive(href, exact) ? "page" : undefined;
  }
</script>

<div class="flex h-[60px] items-center justify-between px-2 py-1 sm:px-4">
  <!-- Left: Menu (mobile) + Logo -->
  <div class="flex items-center gap-3">
    <!-- Mobile: Sheet Trigger (< md only) -->
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
              {#if item.subitems && item.subitems.length > 0}
                <button
                  class="flex w-full items-center justify-between rounded px-3 py-2 text-xl hover:bg-muted"
                  onclick={() => toggleMobileItem(item.label)}
                >
                  <span>{item.label}</span>
                  <ChevronDown class="h-5 w-5 transition-transform duration-200 {expandedItem === item.label ? 'rotate-180' : ''}" />
                </button>
                {#if expandedItem === item.label}
                  <div class="ml-4 flex flex-col gap-0.5">
                    {#each item.subitems as sub}
                      <a
                        href={hrefOf(sub.slug)}
                        onclick={() => { open = false; expandedItem = null; }}
                        class="rounded px-3 py-2 text-base text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {sub.label}
                      </a>
                    {/each}
                  </div>
                {/if}
              {:else}
                <a
                  href={hrefOf(item.slug)}
                  data-active={isActive(hrefOf(item.slug), item.exact)}
                  aria-current={ariaCurrent(hrefOf(item.slug), item.exact)}
                  onclick={() => (open = false)}
                  class="rounded px-3 py-2 text-xl hover:bg-muted data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  {item.label}
                </a>
              {/if}
            {/each}
          </nav>
        </Sheet.Content>
      </Sheet.Root>
    </div>

    <!-- Brand -->
    <a
      href={base}
      class="flex items-center gap-2 text-xl font-bold transition-transform duration-500 ease-out active:scale-95"
    >
      <img src={logo} alt="duas.pro logo" class="h-8 w-auto" />
      <span>duas.pro</span>
    </a>
  </div>

  <!-- Desktop Nav (md+) -->
  <NavigationMenu class="hidden md:flex">
    <NavigationMenuList>
      {#each navItems as item}
        <NavigationMenuItem>
          {#if item.subitems && item.subitems.length > 0}
            <NavigationMenuTrigger data-active={isActive(hrefOf(item.slug), item.exact)}>
              {item.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid w-[320px] gap-1 p-3">
                {#each item.subitems as sub}
                  <li>
                    <NavigationMenuLink href={hrefOf(sub.slug)}>
                      <div class="text-sm font-medium leading-none">{sub.label}</div>
                      <p class="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                        {sub.description}
                      </p>
                    </NavigationMenuLink>
                  </li>
                {/each}
              </ul>
            </NavigationMenuContent>
          {:else}
            <NavigationMenuLink
              href={hrefOf(item.slug)}
              data-active={isActive(hrefOf(item.slug), item.exact)}
              class="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:underline focus:outline-none"
            >
              {item.label}
            </NavigationMenuLink>
          {/if}
        </NavigationMenuItem>
      {/each}
    </NavigationMenuList>
  </NavigationMenu>

  <!-- Right: Actions -->
  <div class="flex items-center gap-1 md:gap-2">
    {#if user}
      <a href="/{$settingsStore.systemLanguage}/profile" aria-label="Profile">
        <Button variant="ghost" size="icon">
          <User class="!h-5 !w-5" />
        </Button>
      </a>
    {:else}
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost" size="icon">
            <span class="text-sm">Login</span>
            <span class="sr-only">Login</span>
          </Button>
        </Popover.Trigger>
        <AuthDialog {user} />
      </Popover.Root>
    {/if}

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
