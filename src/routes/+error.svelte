<script lang="ts">
  import { page } from "$app/state";
  import SeoHead from "$lib/SEOHead.svelte";
</script>

<SeoHead title="duas.pro" />

<h1>Status: {page.status}</h1>
