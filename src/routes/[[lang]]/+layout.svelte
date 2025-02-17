<script lang="ts">
  import { page } from "$app/state";
  import { settingsStore } from "$lib/settings/settings.store";
  import { onMount } from "svelte";
  import "../../app.css";

  let { children } = $props();

  onMount(() => {
    settingsStore.update((state) => ({ ...state, systemLanguage: page.params.lang }));
  });
</script>

{@render children?.()}
