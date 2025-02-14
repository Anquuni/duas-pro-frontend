<script lang="ts">
    import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle    } from '$lib/components/ui/dialog';
    import { Label } from '$lib/components/ui/label';
	import { howToLiveReadingDialogStore } from './live-reading.store';
</script>

<Dialog bind:open={$howToLiveReadingDialogStore}>
    <DialogContent class="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader class="mb-4">
            <DialogTitle>How To: Gemeinsames Lesen</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4">
            <h2 class="text-lg font-semibold mb-2">Einer bestehenden Live-Lesung beitreten</h2>
            <Label for="inputc" class="text-sm font-medium">Gib den Code der Live-Lesung ein:</Label>
        </div>
    </DialogContent>
</Dialog>
