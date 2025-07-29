<script lang="ts">
  import { page } from "$app/state";
  import SeoHead from "$lib/SEOHead.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { settingsStore } from "$lib/settings/settings.store";
</script>

<SeoHead title="404 - Page Not Found" description="" type="organization" />

<div class="min-h-screen flex flex-col items-center justify-center text-center mt-[-60px]">
  <h1 class="text-[10rem] font-extrabold text-primary leading-none">{page.status}</h1>
  <p class="text-2xl font-semibold text-gray-800 mt-4">
    {page.status === 404
      ? 'Die Seite konnte nicht gefunden werden.'
      : 'Ein unerwarteter Fehler ist aufgetreten.'}
  </p>
  <p class="mt-2 text-gray-600">{page.error?.message}</p>
  <Button href="/{$settingsStore.systemLanguage}" class="mt-4 p-6">Zur Startseite</Button>
</div>
