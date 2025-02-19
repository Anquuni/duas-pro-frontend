<script lang="ts">
  import SeoHead from "$lib/SEOHead.svelte";
  import { t } from "$lib/translations/i18n";
</script>

<SeoHead title="duas.pro" />

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation Hallo: {$t(
    "settings.system.title",
  )}
</p>
