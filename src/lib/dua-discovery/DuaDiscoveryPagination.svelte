<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import { goto } from "$app/navigation";

  let { currentPage = 1, totalItems, itemsPerPage = 10, totalPages = 10, baseUrl = "", maxPagesShown = 5 } = $props();

  let value = $state(itemsPerPage + "");
  const perPageOptions = ["20", "50", "100"];

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
    console.log("getPages " + JSON.stringify(pages));
    return pages;
  });

  const getHref = (page: number, size: number) => `${baseUrl}?page=${page}&size=${size}`;
</script>

<div class="mt-6 flex flex-wrap items-center justify-center gap-8">
    <span class="">{currentPage * itemsPerPage - itemsPerPage + 1} - {currentPage * itemsPerPage} of {totalItems} Duas</span>

  <!-- Pagination -->
  <nav class="flex flex-wrap items-center gap-2 text-base" aria-label="pagination">
  
    <!-- Prev Button -->
  <a
    href={getHref(Math.max(currentPage - 1, 1), itemsPerPage)}
    class="inline-flex items-center justify-center rounded border px-4 py-2 text-base font-medium transition-colors
           hover:bg-accent hover:text-accent-foreground
           {currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}"
    aria-disabled={currentPage === 1}
  >
    ‹
  </a>

  <!-- Seitenzahlen -->
  {#each pages as page}
    {#if page === "..."}
      <span class="px-4 py-2 text-base text-muted-foreground">…</span>
    {:else}
      <a
        href={getHref(page, itemsPerPage)}
        class="inline-flex items-center justify-center rounded border px-4 py-2 text-base font-medium transition-colors
               hover:bg-accent hover:text-accent-foreground
               {page === currentPage ? 'border-primary bg-primary text-white' : ''}"
        aria-current={page === currentPage ? "page" : undefined}
      >
        {page}
      </a>
    {/if}
  {/each}

  <!-- Next Button -->
  <a
    href={getHref(Math.min(currentPage + 1, totalPages), itemsPerPage)}
    class="inline-flex items-center justify-center rounded border px-4 py-2 text-base font-medium transition-colors
           hover:bg-accent hover:text-accent-foreground
           {currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}"
    aria-disabled={currentPage === totalPages}
  >
    ›
  </a>
</nav>


  <!-- Selector -->
  <div class="flex items-center gap-2">
    <span class="">Duas anzeigen:</span>

    <Select.Root type="single" {value} onValueChange={(newValue) => {
        const newSize = Number(newValue);
        const newMaxPage = Math.ceil(totalItems / newSize);
        const safePage = Math.min(currentPage, newMaxPage);
        console.log("newSize " + newSize);
        console.log("safePage, newSize) " + getHref(safePage, newSize));
        goto(getHref(safePage, newSize));
      }}>
      <Select.Trigger class="w-[70px] text-base capitalize">
        {itemsPerPage}
      </Select.Trigger>
      <Select.Content>
        {#each perPageOptions as option}
    <a href={getHref(Math.min(currentPage, Math.ceil(totalItems / Number(option))), Number(option))}>
          <Select.Item value={option}>{option}</Select.Item>
        </a>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
</div>
