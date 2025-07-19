<script>
  import { page } from "$app/state";
  import { PUBLIC_BASE_URL } from "$env/static/public";
  import image from '$lib/assets/duas-pro-logo.svg';

  export const SeoSchemaType = {
    ORGANIZATION: "organization",
    WEBPAGE: "webpage"
  };

  let {
    title,
    description,
    type, // andere Option ist: Organization mit duas.pro als Title und logo als image
  } = $props();

  const domain = new URL(page.url).hostname;
  const schemaType = type === SeoSchemaType.ORGANIZATION ? "Organization" : "WebPage";
  const imageKey = type === SeoSchemaType.ORGANIZATION ? "logo" : "image";
  const currentUrl = PUBLIC_BASE_URL + page.url.pathname.toString();
</script>

<svelte:head>
  <title>{title} | {domain}</title>
  <meta name="description" content={description} />
  <meta property="og_site_name" content={domain} />
  <meta property="og:url" content="{currentUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={domain} />
  <meta property="twitter:url" content="{currentUrl}" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  {@html `<script type="application/ld+json">{
      "@context": "https://schema.org",
      "@type": "${schemaType}",
      "name": "${title} | ${domain}",
      "url": "${currentUrl}",
      "${imageKey}": "${image}"
     }</script>`}
</svelte:head>
