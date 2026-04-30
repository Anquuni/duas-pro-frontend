<script lang="ts">
  import BrowsePage from "$lib/dua-discovery/BrowsePage.svelte";
  let { data } = $props();
</script>

<BrowsePage
  {data}
  titleKey="seo.ziyarat.title"
  descriptionKey="seo.ziyarat.description"
  fixedType="ziyarat"
  basePath="ziyarat"
/>
