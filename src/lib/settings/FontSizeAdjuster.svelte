<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { maxFontSize, minFontSize } from "$lib/utils";
  import { Minus, Plus } from "@lucide/svelte";

  export let type: "primary" | "secondary" | "tertiary";
  export let fontSize: number;
  export let onAdjust: (type: "primary" | "secondary" | "tertiary", increment: boolean) => void;
</script>

<div class="flex items-center justify-between">
  <Button variant="outline" size="icon" onclick={() => onAdjust(type, false)} disabled={fontSize <= minFontSize}>
    <Minus class="h-4 w-4" />
  </Button>
  <span class="mx-2 min-w-[2ch] text-center">{fontSize}</span>
  <Button variant="outline" size="icon" onclick={() => onAdjust(type, true)} disabled={fontSize >= maxFontSize}>
    <Plus class="h-4 w-4" />
  </Button>
</div>
