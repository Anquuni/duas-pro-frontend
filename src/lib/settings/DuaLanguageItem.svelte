<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";

  export let language: { value: string; label: string };
  export let onRemove: (language: { value: string; label: string }) => void;
</script>

<Badge variant="secondary">
  {language.label}
  <button class="ml-1 text-xs" on:click={() => onRemove(language)}>×</button>
</Badge>
