<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner";
  import { headerStore } from "$lib/header/header.store";
  import Header from "$lib/header/Header.svelte";
  import { settingsStore } from "$lib/settings/settings.store";
  import { onMount } from "svelte";
  import "../app.css";
  import Footer from "./Footer.svelte";

  let { children } = $props();

  onMount(() => {
    headerStore.update((state) => ({ ...state, isDuaPage: false }));
    settingsStore.update((state) => ({ ...state, systemLanguage: "EN" }));
  });
</script>

<Toaster />

<div class="flex min-h-screen flex-col">
  <Header />
  <main class="flex-1">
    {@render children?.()}
  </main>
  <Footer />
</div>
