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
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import {
  generateCode,
    joinLiveReadingRoom,
    leaveLiveReadingRoom,
    startLiveReadingRoom,
  } from "$lib/live-reading/live-reading.utils";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { Copy, Users, X } from "lucide-svelte";
  import logo from "$lib/assets/duas-pro-logo-no-bg.png";
  import { PUBLIC_BASE_URL } from "$env/static/public";
  import { t } from "$lib/translations/i18n";

  let copied = $state(false);
  let qrSize = 150;
  let dialogOpen = $state(false);
  let inputCode = $state("");
  let isInputError = $state(false);
  let active: "join" | "start" | "plan" | null = $state("join");
  let showPlannedLink = $state(false);
  let plannedCode = $state("");

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

  function copyLiveReadingLink(link: string) {
    navigator.clipboard.writeText(link);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  const liveReadingLink = $derived(
    $liveReadingStore.liveReadingRoomCode
      ? `${PUBLIC_BASE_URL}/duas/${$liveReadingStore.duaRouteName}?code=${$liveReadingStore.liveReadingRoomCode}`
      : "",
  );
  
  const plannedLiveReadingLink = $derived(
    `${PUBLIC_BASE_URL}/duas/${$liveReadingStore.duaRouteName}?code=${plannedCode}&isHost=true`,
  );

  function toggle(panel: typeof active) {
    active = active === panel ? null : panel;
  }

  function planLiveReadingRoom() {
    showPlannedLink = true;
    plannedCode = generateCode();
  }
</script>

<Dialog bind:open={dialogOpen}>
  <DialogTrigger>
    <Button variant="ghost" size="sm">
      {#if !$liveReadingStore.inLiveReadingRoom}
        <Users class="mr-2 h-4 w-4" />
        <span>{$t("live-reading.title")}</span>
      {:else}
        <div class="flex items-center space-x-2">
          <!-- Roter Punkt als Live-Indikator -->
          <div class="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
          <span class="font-semibold text-red-500">{$t("live-reading.live")}</span>
          <span class="hidden text-sm font-medium md:inline">
            • {@html $t("live-reading.code", { code: $liveReadingStore.liveReadingRoomCode })}
            • {@html $t("live-reading.participants", { count: $liveReadingStore.participantsNumber })}
            • {$t("live-reading.host.status", {
              status: $liveReadingStore.isHostOnline ? $t("live-reading.host.online") : $t("live-reading.host.offline"),
            })}
          </span>
        </div>
      {/if}
    </Button>
  </DialogTrigger>

  <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>{$t("live-reading.title")}</DialogTitle>
    </DialogHeader>
    <div class="grid gap-4">
      <!-- TODO: Uncomment if the link is working. Link should show a full explanation page of Live -->
      <!-- <a
        href="/{$settingsStore.systemLanguage}/how-to-live-reading"
        class="text-sm text-blue-600 hover:underline focus:outline-none">
        {$t("live-reading.how-to.title")}
      </a> -->

      {#if !$liveReadingStore.inLiveReadingRoom}
        <!-- Accordion Container -->
        <div class="">
          <!-- Panel 1: Bestehender Live-Lesung beitreten -->
          <div class="rounded-lg border">
            <button class="flex w-full items-center justify-between px-4 py-3 text-left" onclick={() => toggle("join")}>
              <h2 class="font-semibold">{$t("live-reading.join.title")}</h2>
              <span>{active === "join" ? "−" : "+"}</span>
            </button>
            {#if active === "join"}
              <div class="rounded-lg border p-4">
                <Label for="inputc" class="text-sm font-medium">{$t("live-reading.join.label")}</Label>
                <Input
                  id="inputc"
                  bind:value={inputCode}
                  placeholder="Code der Live-Lesung"
                  class="mb-3 mt-1 w-full {isInputError ? 'border-red-500' : 'border-gray-300'}"
                  on:keydown={(event) => event.key === "Enter" && validateAndJoinLiveReading()} />
                {#if isInputError}
                  <p class="mb-3 text-xs text-red-500">{$t("live-reading.join.validation")}</p>
                {/if}
                <p class="mb-3 text-xs text-gray-500">{$t("live-reading.join.spelling")}</p>
                <Button on:click={validateAndJoinLiveReading} class="w-full">{$t("live-reading.join.button")}</Button>
              </div>
            {/if}
          </div>
          <!-- Panel 2: Neue Live-Lesung starten -->
          <div class="rounded-lg border">
            <button
              class="flex w-full items-center justify-between px-4 py-3 text-left"
              onclick={() => toggle("start")}>
              <h2 class="font-semibold">{$t("live-reading.start.title")}</h2>
              <span>{active === "start" ? "−" : "+"}</span>
            </button>
            {#if active === "start"}
              <div class="rounded-lg border p-4">
                <DialogDescription>
                  {$t("live-reading.start.description")}
                </DialogDescription>
                <Button on:click={() => startLiveReadingRoom(generateCode())} class="mt-3 w-full"
                  >{$t("live-reading.start.button")}</Button>
              </div>
            {/if}
          </div>
          <!-- Panel 3: Neue Live-Lesung planen -->
          <div class="rounded-lg border">
            <button class="flex w-full items-center justify-between px-4 py-3 text-left" onclick={() => toggle("plan")}>
              <h2 class="font-semibold">{$t("live-reading.plan.title")}</h2>
              <span>{active === "plan" ? "−" : "+"}</span>
            </button>
            {#if active === "plan"}
              <div class="rounded-lg border p-4">
                <DialogDescription class="mb-2">
                  {$t("live-reading.plan.description")}
                </DialogDescription>

                {#if !showPlannedLink}
                <Button on:click={() => planLiveReadingRoom()} class="mt-3 w-full"
                  >{$t("live-reading.plan.button")}</Button>
                {:else}
                  <div class="flex flex-row">
                    <Input id="link" value={plannedLiveReadingLink} readonly class="mb-2 sm:mb-0" />
                    <Button on:click={() => copyLiveReadingLink(plannedLiveReadingLink)} class="whitespace-nowrap px-3">
                      <Copy class="h-4 w-4" />
                    </Button>
                  </div>
                  {#if copied}
                    <span class="ml-2 text-sm text-gray-600">{$t("live-reading.active.copied")}</span>
                  {/if}
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <div class="text-center">
          <p class="text-sm text-gray-600">{$t("live-reading.code.label")}</p>
          <p class="text-2xl font-semibold">{$liveReadingStore.liveReadingRoomCode}</p>
          <p>{@html $t("live-reading.participants", { count: $liveReadingStore.participantsNumber })}</p>
          {#if $liveReadingStore.isHost}
            <p>{$t("live-reading.active.participation.host")}</p>
          {:else}<p>
              {@html $t("live-reading.active.hostStatus", {
                status: $liveReadingStore.isHostOnline
                  ? $t("live-reading.host.online")
                  : $t("live-reading.host.offline"),
              })}
            </p>
          {/if}
        </div>
        <div class="flex justify-center">
          <SvgQR data={liveReadingLink} {logo} width={qrSize} height={qrSize} />
        </div>
        <div>
          <Label for="link" class="mb-1 block">{$t("live-reading.active.inviteLinkLabel")}</Label>
          <div class="flex flex-row">
            <Input id="link" value={liveReadingLink} readonly class="mb-2 sm:mb-0" />
            <Button on:click={() => copyLiveReadingLink(liveReadingLink)} class="whitespace-nowrap px-3">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
          {#if copied}
            <span class="ml-2 text-sm text-gray-600">{$t("live-reading.active.copied")}</span>
          {/if}
        </div>
        <Button variant="destructive" on:click={endLiveReadingAndCloseDialog}>
          <X class="mr-2 h-4 w-4" />
          {$t("live-reading.active.leave")}
        </Button>
      {/if}
    </div>
  </DialogContent>
</Dialog>
