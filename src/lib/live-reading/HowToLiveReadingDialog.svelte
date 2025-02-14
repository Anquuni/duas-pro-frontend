<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
  import { Label } from "$lib/components/ui/label";
  import { howToLiveReadingDialogStore } from "./live-reading.store";
</script>

<Dialog bind:open={$howToLiveReadingDialogStore}>
  <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
    <DialogHeader class="mb-4">
      <DialogTitle>How To: Gemeinsames Lesen</DialogTitle>
    </DialogHeader>
    <div class="grid gap-4">
      <h2 class="mb-2 text-lg font-semibold">Einer bestehenden Live-Lesung beitreten</h2>
      <Label for="inputc" class="text-sm font-medium">Gib den Code der Live-Lesung ein:</Label>
    </div>
  </DialogContent>
</Dialog>
