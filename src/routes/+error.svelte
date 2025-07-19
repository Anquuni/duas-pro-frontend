<script lang="ts">
  import { page } from "$app/state";
  import SeoHead from "$lib/SEOHead.svelte";
</script>

<SeoHead title="404 - Page Not Found" description="" type="organization" />

<h1>Status: {page.status}</h1>
