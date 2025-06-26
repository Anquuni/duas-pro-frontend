<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { howToLiveReadingDialogStore, liveReadingStore } from "$lib/live-reading/live-reading.store";
  import {
    joinLiveReadingRoom,
    leaveLiveReadingRoom,
    startLiveReadingRoom,
  } from "$lib/live-reading/live-reading.utils";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { Copy, Users, X } from "lucide-svelte";
  import logo from '$lib/assets/duas-pro-logo-no-bg.png';
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let copied = $state(false);
  let qrSize = 150;
  let dialogOpen = $state(false);
  let inputCode = $state("");
  let isInputError = $state(false);

  function validateAndJoinLiveReading() {
    if (!inputCode.trim()) {
      isInputError = true;
      return;
    }
    isInputError = false;
    joinLiveReadingRoom(inputCode);
  }

  function endLiveReadingAndCloseDialog() {
    if ($liveReadingStore.isHost) {
      console.log("TODO: Confirm ending of live reading session");
    }
    leaveLiveReadingRoom();
    dialogOpen = false;
  }

  function copyLiveReadingLink() {
    navigator.clipboard.writeText(liveReadingLink);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  const liveReadingLink = $derived(
    $liveReadingStore.liveReadingRoomCode
      ? `${PUBLIC_BASE_URL}/duas/${$liveReadingStore.duaRouteName}?code=${$liveReadingStore.liveReadingRoomCode}`
      : "",
  );
</script>

<Dialog bind:open={dialogOpen}>
  <DialogTrigger>
    <Button variant="ghost" size="sm">
      {#if !$liveReadingStore.inLiveReadingRoom}
        <Users class="mr-2 h-4 w-4" />
        <span>Join</span>
      {:else}
        <div class="flex items-center space-x-2">
          <!-- Roter Punkt als Live-Indikator -->
          <div class="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
          <span class="font-semibold text-red-500">Live</span>
          <span class="hidden text-sm font-medium md:inline">
            • Code: {$liveReadingStore.liveReadingRoomCode}
            • {$liveReadingStore.participantsNumber} Teilnehmer • Host {$liveReadingStore.isHostOnline
              ? "online"
              : "offline"}
          </span>
        </div>
      {/if}
    </Button>
  </DialogTrigger>
  <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
    <DialogHeader class="mb-4">
      <DialogTitle>Gemeinsames Lesen</DialogTitle>
    </DialogHeader>
    <div class="grid gap-4">
      <!-- Infobutton zum Öffnen des Dialogs -->
      <button
        type="button"
        class="text-sm text-blue-600 hover:underline focus:outline-none"
        onclick={() => howToLiveReadingDialogStore.set(true)}>
        Wie funktioniert Live-Reading?
      </button>
      {#if !$liveReadingStore.inLiveReadingRoom}
        <div class="space-y-6">
          <!-- Bestehender Live-Lesung beitreten -->
          <div class="rounded-lg border p-4">
            <h2 class="mb-2 text-lg font-semibold">Einer bestehenden Live-Lesung beitreten</h2>
            <Label for="inputc" class="text-sm font-medium">Gib den Code der Live-Lesung ein:</Label>
            <Input
              id="inputc"
              bind:value={inputCode}
              placeholder="Code der Live-Lesung"
              class="mt-1 mb-3 w-full {isInputError ? 'border-red-500' : 'border-gray-300'}"
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
            <Button on:click={() => startLiveReadingRoom()} class="mt-3 w-full">Live-Lesung starten</Button>
          </div>
        </div>
      {:else}
        <div class="text-center">
          <p class="font-semibold">Live-Lesung aktiv</p>
          <p>
            Du nimmst
            {#if $liveReadingStore.isHost}
              <span class="font-semibold">als Host</span>
            {/if}
            am Live-Reading-Room <span class="font-semibold">{$liveReadingStore.liveReadingRoomCode}</span> teil.
          </p>
          <span class="mt-2">
            <p>Aktuelle Teilnehmer: <span class="font-semibold">{$liveReadingStore.participantsNumber}</span></p>
            <p>
              Der Host ist <span class="font-semibold">{$liveReadingStore.isHostOnline ? "online" : "offline"}</span>.
            </p>
          </span>
        </div>
        <div class="flex justify-center">
          <SvgQR data={liveReadingLink} {logo} width={qrSize} height={qrSize} />
        </div>
        <div>
          <Label for="link" class="mb-1 block">Einladungs-Link</Label>
          <div class="flex flex-col sm:flex-row">
            <Input id="link" value={liveReadingLink} readonly class="mb-2 sm:mr-2 sm:mb-0" />
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
