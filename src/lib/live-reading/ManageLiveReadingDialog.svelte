<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { liveReadingStore } from "$lib/live-reading/live-reading.store";
  import {
    joinLiveReadingRoom,
    leaveLiveReadingRoom,
  } from "$lib/live-reading/live-reading.utils";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import { Copy, Users, X } from "@lucide/svelte";
  import logo from "$lib/assets/duas-pro-logo.png";
  import { PUBLIC_BASE_URL } from "$env/static/public";
  import { t } from "$lib/translations/i18n";

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
</script>

<Dialog bind:open={dialogOpen}>
  <DialogTrigger>
    <Button variant="ghost" size="sm">
      {#if !$liveReadingStore.inLiveReadingRoom}
        <Users class="px-0 h-4 w-4" />
        <span>{$t("live-reading.title")}</span>
      {:else}
        <div class="flex items-center space-x-2">
          <!-- Roter Punkt als Live-Indikator -->
          <div class="h-2 w-2 animate-pulse rounded-full {!$liveReadingStore.isHostOnline ? 'bg-yellow-500' : 'bg-red-500'}"></div>
          <span class="font-semibold {!$liveReadingStore.isHostOnline ? 'text-yellow-500' : 'text-red-500'}">{$t("live-reading.live")}</span>
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
        <div class="rounded-lg border p-4">
          <Label for="inputc" class="text-sm font-medium">{$t("live-reading.join.label")}</Label>
          <Input
            id="inputc"
            bind:value={inputCode}
            placeholder={$t('live-reading.placeholder')}
            class="mb-3 mt-1 w-full {isInputError ? 'border-red-500' : 'border-gray-300'}"
            onkeydown={(event) => event.key === "Enter" && validateAndJoinLiveReading()} />
          {#if isInputError}
            <p class="mb-3 text-xs text-red-500">{$t("live-reading.join.validation")}</p>
          {/if}
          <p class="mb-3 text-xs text-gray-500">{$t("live-reading.join.spelling")}</p>
          <Button onclick={validateAndJoinLiveReading} class="w-full">{$t("live-reading.join.button")}</Button>
        </div>
        <p class="text-xs text-gray-500">{$t("live-reading.create.profile-hint")}</p>
      {:else}
        <div class="text-center">
          <p class="text-sm text-gray-600">{$t("live-reading.code.label")}</p>
          <p class="text-2xl font-semibold">{$liveReadingStore.liveReadingRoomCode}</p>
          <p>{@html $t("live-reading.participants", { count: $liveReadingStore.participantsNumber })}</p>
          {#if $liveReadingStore.isHost}
            <p>{$t("live-reading.active.participation.host")}</p>
          {/if}
          <p>
            {@html $t("live-reading.active.hostStatus", {
              status: $liveReadingStore.isHostOnline ? $t("live-reading.host.online") : $t("live-reading.host.offline"),
            })}
          </p>
        </div>
        <div class="flex justify-center">
          <SvgQR data={liveReadingLink} {logo} width={qrSize} height={qrSize} />
        </div>
        <div>
          <Label for="link" class="mb-1 block">{$t("live-reading.active.inviteLinkLabel")}</Label>
          <div class="flex flex-row">
            <Input id="link" value={liveReadingLink} readonly class="mb-2 sm:mb-0" />
            <Button onclick={() => copyLiveReadingLink(liveReadingLink)} class="whitespace-nowrap px-3">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
          {#if copied}
            <span class="ml-2 text-sm text-gray-600">{$t("live-reading.active.copied")}</span>
          {/if}
        </div>
        <Button variant="destructive" onclick={endLiveReadingAndCloseDialog}>
          <X class="mr-2 h-4 w-4" />
          {$t("live-reading.active.leave")}
        </Button>
      {/if}
    </div>
  </DialogContent>
</Dialog>
