<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner";
  import Header from "$lib/header/Header.svelte";
  import { languages, settingsStore } from "$lib/settings/settings.store";
  import "../app.css";
  import Footer from "./Footer.svelte";
  import { PUBLIC_ENVIRONMENT } from "$env/static/public";
  import { page } from "$app/state";
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'

  let { data, children } = $props();
  let { session, user, supabase } = $derived(data);

  const currentLanguage = $derived(
    languages.find((lang) => lang.value === $settingsStore.systemLanguage) || { rtl: false },
  );
  
  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })
    return () => data.subscription.unsubscribe()
  })
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
  <Header {user} />
  <div class="flex flex-1 flex-col ${currentLanguage.rtl ? 'rtl' : ''}">
    <main class="flex-1">
      {@render children?.()}
    </main>
    <Footer />
  </div>
</div>
