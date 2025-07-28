<script lang="ts">
  import { maxFontSize, minFontSize } from "$lib/utils";
  import { Slider } from "$lib/components/ui/slider/index.js";

  export let type: "primary" | "secondary" | "tertiary";
  export let fontSize: number;
  export let onChange: (type: "primary" | "secondary" | "tertiary", newFontSize: number) => void;
</script>

<Slider
  aria-label="Set font size"
  type="single"
  onValueChange={(val) => onChange(type, val)}
  value={fontSize}
  min={minFontSize}
  max={maxFontSize}
  step={1}
  class="mt-2 w-full" />
