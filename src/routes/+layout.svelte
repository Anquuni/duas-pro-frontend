<script lang="ts">
  import Header from "$lib/header/Header.svelte";
  import "../app.css";
  import { headerStore } from "$lib/header/header.store";
  import { page } from "$app/state";
  import Footer from "./Footer.svelte";
  import { Toaster } from "$lib/components/ui/sonner";

  $: {
    // Überprüfen Sie, ob die aktuelle Route eine Dua-Seite ist
    const isDuaPage = page.route.id?.startsWith("/duas/") ?? false;
    headerStore.update((state) => ({ ...state, isDuaPage }));
  }
</script>

<Toaster />

<div class="flex min-h-screen flex-col">
  <Header />
  <main class="flex-1">
    <slot />
  </main>
  <Footer />
</div>
