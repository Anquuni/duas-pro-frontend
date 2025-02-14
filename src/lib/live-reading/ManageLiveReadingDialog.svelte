<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Users, Copy, X } from "lucide-svelte";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "$lib/components/ui/dialog";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { joinLiveReading, leftLiveReadingSession, startLiveReading } from "$lib/live-reading/live-reading.utils";
  import { howToLiveReadingDialogStore, liveReadingStore } from "$lib/live-reading/live-reading.store";

  let copied = false;
  let qrSize = 150;
  let logo = "https://svelte-put.vnphanquang.com/images/svelte-put-logo.svg";
  let dialogOpen = false;
  let inputCode = "";
  let isInputError = false;

  function validateAndJoinLiveReading() {
    if (!inputCode.trim()) {
      isInputError = true;
      return;
    }
    isInputError = false;
    joinLiveReading(inputCode);
  }

  function endLiveReadingAndCloseDialog() {
    leftLiveReadingSession();
    dialogOpen = false;
  }

  function copyLiveReadingLink() {
    navigator.clipboard.writeText(liveReadingLink);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  $: liveReadingLink = $liveReadingStore.liveReadingCode
    ? `https://duas.pro/duas/${$liveReadingStore.duaRouteName}?code=${$liveReadingStore.liveReadingCode}`
    : "";
</script>

<Dialog bind:open={dialogOpen}>
  <DialogTrigger>
    <Button variant="ghost" size="sm">
      {#if !$liveReadingStore.isLiveReading}
        <Users class="mr-2 h-4 w-4" />
        <span>Join</span>
      {:else}
        <div class="flex items-center space-x-2">
          <!-- Roter Punkt als Live-Indikator -->
          <div class="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
          <span class="font-semibold text-red-500">Live</span>
          <span class="text-sm font-medium text-gray-700">(Code: {$liveReadingStore.liveReadingCode})</span>
        </div>
      {/if}
    </Button>
  </DialogTrigger>
  <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
    <DialogHeader class="mb-4">
      <DialogTitle>Gemeinsames Lesen</DialogTitle>
    </DialogHeader>
    <div class="grid gap-4">
      {#if !$liveReadingStore.isLiveReading}
        <div class="space-y-6">
          <!-- Infobutton zum Öffnen des Dialogs -->
          <button
            type="button"
            class="text-sm text-blue-600 hover:underline focus:outline-none"
            on:click={() => howToLiveReadingDialogStore.set(true)}>
            Wie funktioniert Live-Reading?
          </button>
          <!-- Bestehender Live-Lesung beitreten -->
          <div class="rounded-lg border p-4">
            <h2 class="mb-2 text-lg font-semibold">Einer bestehenden Live-Lesung beitreten</h2>
            <Label for="inputc" class="text-sm font-medium">Gib den Code der Live-Lesung ein:</Label>
            <Input
              id="inputc"
              bind:value={inputCode}
              placeholder="Code der Live-Lesung"
              class="mb-3 mt-1 w-full {isInputError ? 'border-red-500' : 'border-gray-300'}"
              on:keydown={(event) => event.key === "Enter" && validateAndJoinLiveReading()} />
            {#if isInputError}
              <p class="mb-3 text-xs text-red-500">Bitte einen Code eingeben!</p>
            {/if}
            <p class="mb-3 text-xs text-gray-500">Groß- und Kleinschreibung wird nicht berücksichtigt.</p>
            <Button on:click={validateAndJoinLiveReading} class="w-full">Beitreten</Button>
          </div>

          <!-- Visueller Trenner -->
          <div class="relative flex items-center">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="px-4 text-sm text-gray-500">ODER</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <!-- Neue Live-Lesung starten -->
          <div class="rounded-lg border p-4">
            <h2 class="mb-2 text-lg font-semibold">Eine neue Live-Lesung starten</h2>
            <DialogDescription>
              Starte eine Live-Lesung und lade Freunde ein, gemeinsam zu lesen. Du bestimmst bei welchem Vers ihr gerade
              seid.
            </DialogDescription>
            <Button on:click={() => startLiveReading()} class="mt-3 w-full">Live-Lesung starten</Button>
          </div>
        </div>
      {:else}
        <div class="text-center">
          <p class="font-semibold">Live-Lesung aktiv</p>
          <p>Code: {$liveReadingStore.liveReadingCode}</p>
          <p>
            {$liveReadingStore.leads
              ? "Du bestimmst bei welchem Vers ihr gerade seid!"
              : "Wenn der Leiter zum nächsten Vers geht, wirst du automatisch dahin gescrollt."}
          </p>
        </div>
        <div class="flex justify-center">
          <SvgQR data={liveReadingLink} {logo} width={qrSize} height={qrSize} />
        </div>
        <div>
          <Label for="link" class="mb-1 block">Einladungs-Link</Label>
          <div class="flex flex-col sm:flex-row">
            <Input id="link" value={liveReadingLink} readonly class="mb-2 sm:mb-0 sm:mr-2" />
            <Button on:click={copyLiveReadingLink} class="whitespace-nowrap">
              {#if copied}
                Kopiert!
              {:else}
                <Copy class="mr-2 h-4 w-4" />
                Kopieren
              {/if}
            </Button>
          </div>
        </div>
        <Button variant="destructive" on:click={endLiveReadingAndCloseDialog}>
          <X class="mr-2 h-4 w-4" />
          Live-Lesung verlassen
        </Button>
      {/if}
    </div>
  </DialogContent>
</Dialog>
