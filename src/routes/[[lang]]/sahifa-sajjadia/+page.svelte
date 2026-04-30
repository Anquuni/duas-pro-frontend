<script lang="ts">
  import BrowsePage from "$lib/dua-discovery/BrowsePage.svelte";
  let { data } = $props();
</script>

<BrowsePage
  {data}
  titleKey="seo.sahifa-sajjadia.title"
  descriptionKey="seo.sahifa-sajjadia.description"
/>
