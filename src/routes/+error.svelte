<script lang="ts">
  import { page } from "$app/state";
  import SeoHead from "$lib/SEOHead.svelte";
  import logo from '$lib/assets/duas-pro-logo.svg';
</script>

<SeoHead title="404 - Page Not Found" description=""
  image={logo} type="organization" />

<h1>Status: {page.status}</h1>
