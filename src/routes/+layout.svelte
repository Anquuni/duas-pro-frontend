<script lang="ts">
  import { page } from "$app/state";
  import { Toaster } from "$lib/components/ui/sonner";
  import { headerStore } from "$lib/header/header.store";
  import Header from "$lib/header/Header.svelte";
  import "../app.css";
  import Footer from "./Footer.svelte";

  let { children } = $props();

  $effect(() => {
    // Überprüfen Sie, ob die aktuelle Route eine Dua-Seite ist
    const isDuaPage = page.route.id?.startsWith("/duas/") ?? false;
    headerStore.update((state) => ({ ...state, isDuaPage }));
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
