<script lang="ts">
  import SeoHead from "$lib/SEOHead.svelte";
  import { t } from "$lib/translations/i18n";
  import PostCard from "$lib/posts/PostCard.svelte";

  let { data } = $props();
</script>

<SeoHead title={$t("seo.blog.title")} description={$t("seo.blog.description")} type="organization" />
<div class="p-4 sm:p-6 md:p-8">
  <div class="mx-auto max-w-3xl text-center">
    <h1 class="text-3xl font-bold tracking-tight">
      {$t("seo.blog.title")}
    </h1>
    <p class="mt-3 text-base text-gray-700 dark:text-gray-300">
      {$t("seo.blog.description")}
    </p>
  </div>

  <!-- 📜 Posts List -->
  <div class="mx-auto mt-10 flex max-w-5xl flex-col gap-8 px-4 md:px-8 lg:px-12">
    {#each data.posts.items as post}
      <PostCard {post} />
    {/each}
  </div>
</div>
