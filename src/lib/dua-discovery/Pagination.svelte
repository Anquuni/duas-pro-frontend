<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { settingsStore } from "$lib/settings/settings.store";

  let { totalPages, totalCount } = $props();

  let currentPage = $derived(Number(page.url.searchParams.get("page") ?? 1));
  let pageSize = $derived(Number(page.url.searchParams.get("size") ?? 20));
  const pageSizeOptions = ["20", "50", "100"];
  const maxPagesShown = 5;

  const pages: (number | "...")[] = $derived.by(() => {
    const pages: (number | "...")[] = [];
    const sideCount = Math.floor((maxPagesShown - 3) / 2); // -3: first, last, and 2 ellipses

    if (totalPages <= maxPagesShown) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    let start = Math.max(2, currentPage - sideCount);
    let end = Math.min(totalPages - 1, currentPage + sideCount);

    if (start > 2) {
      pages.push("...");
    } else {
      start = 2;
    }

    if (end < totalPages - 1) {
      for (let i = start; i <= end; i++) pages.push(i);
      pages.push("...");
    } else {
      end = totalPages - 1;
      for (let i = start; i <= end; i++) pages.push(i);
    }

    pages.push(totalPages);
    return pages;
  });

  function buildPaginationUrl(currentPage: number, size: number) {
    let url = `/${$settingsStore.systemLanguage}/duas?page=${currentPage}&size=${size}`;
    const types = page.url.searchParams.getAll("types");
    if (types.length > 0) {
      url += `&types=${types}`;
    }
    return url;
  }

  const firstDuaNumber = $derived(currentPage * pageSize - pageSize + 1);
  const lastDuaNumber = $derived(currentPage * pageSize);
</script>

<div class="mt-6 flex flex-wrap items-center justify-center gap-8">
  <span class="">{firstDuaNumber} - {lastDuaNumber} of {totalCount} Duas</span>

  <!-- Pagination -->
  <nav class="flex flex-wrap items-center gap-2 text-base" aria-label="pagination">
    <!-- Prev Button -->
    <a
      href={buildPaginationUrl(Math.max(currentPage - 1, 1), pageSize)}
      class="inline-flex items-center justify-center rounded border px-4 py-2 text-base font-medium transition-colors
           hover:bg-accent hover:text-accent-foreground
           {currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}"
      aria-disabled={currentPage === 1}>
      ‹
    </a>

    <!-- Seitenzahlen -->
    {#each pages as page}
      {#if page === "..."}
        <span class="px-4 py-2 text-base text-muted-foreground">…</span>
      {:else}
        <a
          href={buildPaginationUrl(page, pageSize)}
          class="inline-flex items-center justify-center rounded border px-4 py-2 text-base font-medium transition-colors
               hover:bg-accent hover:text-accent-foreground
               {page === currentPage ? 'border-primary bg-primary text-white' : ''}"
          aria-current={page === currentPage ? "page" : undefined}>
          {page}
        </a>
      {/if}
    {/each}

    <!-- Next Button -->
    <a
      href={buildPaginationUrl(Math.min(currentPage + 1, totalPages), pageSize)}
      class="inline-flex items-center justify-center rounded border px-4 py-2 text-base font-medium transition-colors
           hover:bg-accent hover:text-accent-foreground
           {currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}"
      aria-disabled={currentPage === totalPages}>
      ›
    </a>
  </nav>

  <!-- Selector -->
  <div class="flex items-center gap-2">
    <span class="">Duas anzeigen:</span>

    <Select.Root
      type="single"
      value={pageSize.toString()}
      onValueChange={(newPageSize) => goto(buildPaginationUrl(1, Number(newPageSize)))}>
      <Select.Trigger class="w-[70px] text-base capitalize">
        {pageSize}
      </Select.Trigger>
      <Select.Content>
        {#each pageSizeOptions as pageSizeOption}
          <a href={buildPaginationUrl(1, Number(pageSizeOption))}>
            <Select.Item value={pageSizeOption}>{pageSizeOption}</Select.Item>
          </a>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
</div>
