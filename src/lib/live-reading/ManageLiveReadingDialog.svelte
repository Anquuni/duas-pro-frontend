<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Users, Copy, X } from 'lucide-svelte';
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger
    } from '$lib/components/ui/dialog';
    import { Label } from '$lib/components/ui/label';
    import { Input } from '$lib/components/ui/input';
    import SvgQR from '@svelte-put/qr/svg/QR.svelte';
	import { joinLiveReading, leftLiveReadingSession, startLiveReading } from '$lib/live-reading/live-reading.utils';
	import { howToLiveReadingDialogStore, liveReadingStore } from '$lib/live-reading/live-reading.store';

    let copied = false;
    let qrSize = 150;
    let logo = 'https://svelte-put.vnphanquang.com/images/svelte-put-logo.svg';
    let dialogOpen = false;
    let inputCode = "";
    let isInputError = false;

    function validateAndJoinLiveReading() {
        if (!inputCode.trim()) {
            isInputError = true;
            return;
        }
        isInputError = false;
        joinLiveReading(inputCode)
    }

    function endLiveReadingAndCloseDialog() {
        leftLiveReadingSession()
        dialogOpen = false;
    }

    function copyLiveReadingLink() {
        navigator.clipboard.writeText(liveReadingLink);
        copied = true;
        setTimeout(() => copied = false, 2000);
    }

    $: liveReadingLink = $liveReadingStore.liveReadingCode 
        ? `https://duas.pro/duas/${$liveReadingStore.duaRouteName}?code=${$liveReadingStore.liveReadingCode}` 
        : '';
</script>

<Dialog bind:open={dialogOpen}>
    <DialogTrigger>
        <Button variant="ghost" size="sm">
            {#if !$liveReadingStore.isLiveReading}
                <Users class="h-4 w-4 mr-2" />
                <span>Join</span>
            {:else}
                <div class="flex items-center space-x-2">
                    <!-- Roter Punkt als Live-Indikator -->
                    <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span class="text-red-500 font-semibold">Live</span>
                    <span class="text-gray-700 text-sm font-medium">(Code: {$liveReadingStore.liveReadingCode})</span>
                </div>
            {/if}

        </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader class="mb-4">
            <DialogTitle>Gemeinsames Lesen</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4">
            {#if !$liveReadingStore.isLiveReading}
            <div class="space-y-6">
                <!-- Infobutton zum Öffnen des Dialogs -->
                <button type="button"
                    class="text-sm text-blue-600 hover:underline focus:outline-none"
                    on:click={() => howToLiveReadingDialogStore.set(true)}>
                    Wie funktioniert Live-Reading?
                </button>
                <!-- Bestehender Live-Lesung beitreten -->
                <div class="p-4 border rounded-lg">
                    <h2 class="text-lg font-semibold mb-2">Einer bestehenden Live-Lesung beitreten</h2>
                    <Label for="inputc" class="text-sm font-medium">Gib den Code der Live-Lesung ein:</Label>
                    <Input id="inputc" bind:value={inputCode} placeholder="Code der Live-Lesung"
                     class="w-full mt-1 mb-3 {(isInputError ? 'border-red-500' : 'border-gray-300')}"
                     on:keydown={(event) => event.key === 'Enter' && validateAndJoinLiveReading()}
                    />
                    {#if isInputError}
                        <p class="text-xs text-red-500 mb-3">Bitte einen Code eingeben!</p>
                    {/if}
                    <p class="text-xs text-gray-500 mb-3">Groß- und Kleinschreibung wird nicht berücksichtigt.</p>
                    <Button on:click={validateAndJoinLiveReading} class="w-full">Beitreten</Button>
                </div>
            
                <!-- Visueller Trenner -->
                <div class="relative flex items-center">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="px-4 text-gray-500 text-sm">ODER</span>
                    <div class="flex-grow border-t border-gray-300"></div>
                </div>
            
                <!-- Neue Live-Lesung starten -->
                <div class="p-4 border rounded-lg">
                    <h2 class="text-lg font-semibold mb-2">Eine neue Live-Lesung starten</h2>
                    <DialogDescription>
                        Starte eine Live-Lesung und lade Freunde ein, gemeinsam zu lesen. Du bestimmst bei welchem Vers ihr gerade seid.
                    </DialogDescription>
                    <Button on:click={() => startLiveReading()} class="w-full mt-3">Live-Lesung starten</Button>
                </div>
            </div>
            
            {:else}
                <div class="text-center">
                    <p class="font-semibold">Live-Lesung aktiv</p>
                    <p>Code: {$liveReadingStore.liveReadingCode}</p>
                    <p>{$liveReadingStore.leads ? "Du bestimmst bei welchem Vers ihr gerade seid!" : "Wenn der Leiter zum nächsten Vers geht, wirst du automatisch dahin gescrollt."}</p>
                </div>
                <div class="flex justify-center">
                    <SvgQR 
                        data={liveReadingLink} 
                        logo={logo}
                        width={qrSize} 
                        height={qrSize}
                    />
                </div>
                <div>
                    <Label for="link" class="mb-1 block">Einladungs-Link</Label>
                    <div class="flex flex-col sm:flex-row">
                        <Input id="link" value={liveReadingLink} readonly class="mb-2 sm:mb-0 sm:mr-2" />
                        <Button on:click={copyLiveReadingLink} class="whitespace-nowrap">
                            {#if copied}
                                Kopiert!
                            {:else}
                                <Copy class="h-4 w-4 mr-2" />
                                Kopieren
                            {/if}
                        </Button>
                    </div>
                </div>
                <Button variant="destructive" on:click={endLiveReadingAndCloseDialog}>
                    <X class="h-4 w-4 mr-2" />
                    Live-Lesung verlassen
                </Button>
            {/if}
        </div>
    </DialogContent>
</Dialog>