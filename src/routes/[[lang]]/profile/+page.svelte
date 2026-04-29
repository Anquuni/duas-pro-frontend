<script lang="ts">
  import { settingsStore } from "$lib/settings/settings.store";
  import SessionCard from "$lib/live-reading/SessionCard.svelte";
  import SeoHead from "$lib/SEOHead.svelte";
  import { User } from "@lucide/svelte";

  let { data } = $props();
</script>

<SeoHead title="Profile – duas.pro" description="" type="webpage" />

<div class="container mx-auto max-w-2xl px-4 py-8">
  <!-- User info -->
  <div class="mb-8 flex items-center gap-4">
    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
      <User size={28} />
    </div>
    <div>
      <p class="text-xs text-muted-foreground">Signed in as</p>
      <p class="font-semibold">{data.user?.email}</p>
    </div>
  </div>

  <!-- Sessions -->
  <h2 class="mb-4 text-xl font-semibold">Planned Live Reading Sessions</h2>

  {#if data.sessions.length === 0}
    <div class="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
      <p class="mb-1 font-medium">No sessions yet</p>
      <p class="mb-4 text-sm">Open any dua and tap "Plan Live Reading" to create one.</p>
      <a
        href="/{$settingsStore.systemLanguage}/duas"
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
        Browse Duas
      </a>
    </div>
  {:else}
    <div class="flex flex-col gap-3">
      {#each data.sessions as session (session.id)}
        <SessionCard {session} />
      {/each}
    </div>
  {/if}
</div>
