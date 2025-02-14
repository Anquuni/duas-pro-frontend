<script lang="ts">
    import { headerStore } from '$lib/stores/headerStore';
    import { duaStore } from '$lib/stores/dua';
    import { Tabs, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
    import { Book, Languages, Presentation } from 'lucide-svelte';
	import LiveReadingDialog from '$lib/live-reading/ManageLiveReadingDialog.svelte';
	import ManageLiveReadingDialog from '$lib/live-reading/ManageLiveReadingDialog.svelte';

    function setActiveTab(tab: string | undefined) {
        if (tab) {
            duaStore.update((state) => ({ ...state, currentTab: tab }));
        }
    }
</script>

<div class="flex h-[30px] items-center justify-between px-4">
    <h1 class="w-1/4 truncate text-sm font-semibold">{$headerStore.duaTitle || 'Dua'}</h1>

    {#if $headerStore.showViewTabs}
        <div class="flex flex-1 justify-center">
            <Tabs bind:value={$duaStore.currentView} onValueChange={setActiveTab}>
                <TabsList class="h-7">
                    <TabsTrigger value="translation" class="px-2 py-0.5">
                        <Languages class="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="reading" class="px-2 py-0.5">
                        <Book class="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="presentation" class="px-2 py-0.5">
                        <Presentation class="h-3 w-3" />
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    {/if}

    <div class="flex w-1/4 justify-end">
        <ManageLiveReadingDialog />
    </div>
</div>