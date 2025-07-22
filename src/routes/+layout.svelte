<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner";
  import Header from "$lib/header/Header.svelte";
  import { languages, settingsStore } from "$lib/settings/settings.store";
  import "../app.css";
  import Footer from "./Footer.svelte";
  import { PUBLIC_ENVIRONMENT } from "$env/static/public";
  import { page } from "$app/state";

  let { children } = $props();

  const currentLanguage = $derived(
    languages.find((lang) => lang.value === $settingsStore.systemLanguage) || { rtl: false },
  );
</script>

<svelte:head>
  <link rel="canonical" href="{page.url.toString()}" />
  {#if PUBLIC_ENVIRONMENT === "prod"}
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-RD59M3PRTP"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-RD59M3PRTP');
    </script>
  {/if}
</svelte:head>

<Toaster />

<div class="flex min-h-screen flex-col">
  <Header />
  <div class="flex flex-1 flex-col" class:rtl={currentLanguage.rtl}>
    <main class="flex-1">
      {@render children?.()}
    </main>
    <Footer />
  </div>
</div>
