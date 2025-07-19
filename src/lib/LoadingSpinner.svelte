<script lang="ts">
  export let size: number = 24;
  export let className: string = "";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={`h-6 w-6 animate-spin ${className}`}>
  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
</svg>
