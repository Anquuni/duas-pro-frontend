<script>
  import { page } from "$app/state";
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let {
    title = "Home | Example.com",
    description = "Description of your website.",
    // Image Size: 1,91:1. 600x314 - 800x419 - 1200x628 - 1600x838 - 1800x942
    image = "https://example.com/your-logo.png",
  } = $props();

  const domain = new URL(page.url).hostname;
</script>

<svelte:head>
  <title>{title} | {domain}</title>
  <meta name="description" content={description} />
  <meta property="og_site_name" content={domain} />
  <meta property="og:url" content="{PUBLIC_BASE_URL}{page.url.pathname.toString()}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={domain} />
  <meta property="twitter:url" content="{PUBLIC_BASE_URL}{page.url.pathname.toString()}" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  {@html `<script type="application/ld+json">{
      "@context": "https://schema.org",
      "@type": "Website",
      "name": "${title} | ${domain}",
      "url": "${PUBLIC_BASE_URL}${page.url.pathname}",
      "logo": ${image} 
     }</script>`}
</svelte:head>
