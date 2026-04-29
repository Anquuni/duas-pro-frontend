<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { settingsStore } from "$lib/settings/settings.store";
  import { daysOfWeek, formatSchedule, type PlannedSession, type SessionSchedule } from "./session.model";
  import { PUBLIC_BASE_URL } from "$env/static/public";
  import SvgQR from "@svelte-put/qr/svg/QR.svelte";
  import logo from "$lib/assets/duas-pro-logo.png";
  import { Calendar, Check, Download, Pencil, Play, Trash2, X } from "@lucide/svelte";
  import { t } from "$lib/translations/i18n";

  let { session }: { session: PlannedSession } = $props();

  let editing = $state(false);
  let showQR = $state(false);
  let confirmDelete = $state(false);

  let editName = $state(session.name);
  let editType = $state<"once" | "recurring">(session.schedule.type);
  let editDate = $state(session.schedule.type === "once" ? session.schedule.date : "");
  let editDay = $state<string>("monday");

  $effect(() => {
    if (!editing) {
      editName = session.name;
      editType = session.schedule.type;
      editDate = session.schedule.type === "once" ? session.schedule.date : "";
      editDay = session.schedule.type === "recurring" ? session.schedule.day : "monday";
    }
  });

  let qrContainer = $state<HTMLDivElement | undefined>(undefined);

  const liveLink = $derived(
    `${PUBLIC_BASE_URL}/${$settingsStore.systemLanguage}/duas/${session.dua_slug}?code=${session.code}&isHost=true`,
  );

  function buildSchedule(): SessionSchedule {
    if (editType === "once") return { type: "once", date: editDate };
    return { type: "recurring", day: editDay as typeof daysOfWeek[number] };
  }

  function downloadQR() {
    const svg = qrContainer?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.name.replace(/\s+/g, "-")}-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<Card>
  <CardContent class="pt-4 pb-4">
    <!-- Header row -->
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0 flex-1">
        <p class="truncate font-semibold">{session.name}</p>
        <p class="truncate text-sm text-muted-foreground">
          {session.dua_title["translit"] ?? session.dua_slug}
        </p>
        <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={12} />
          <span>{formatSchedule(session.schedule)}</span>
          <span class="font-mono font-bold tracking-widest text-foreground">{session.code}</span>
        </div>
      </div>

      <div class="flex flex-shrink-0 gap-1">
        <Button
          variant="ghost" size="icon" class="h-8 w-8" title={$t("session-card.start-session")}
          onclick={() => goto(`/${$settingsStore.systemLanguage}/duas/${session.dua_slug}?code=${session.code}&isHost=true`)}>
          <Play size={15} />
        </Button>
        <Button
          variant="ghost" size="icon" class="h-8 w-8" title={$t("session-card.qr-code")}
          onclick={() => { showQR = !showQR; editing = false; confirmDelete = false; }}>
          <Download size={15} />
        </Button>
        <Button
          variant="ghost" size="icon" class="h-8 w-8" title={$t("session-card.edit")}
          onclick={() => { editing = !editing; showQR = false; confirmDelete = false; }}>
          <Pencil size={15} />
        </Button>
        <Button
          variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:text-destructive" title={$t("session-card.delete")}
          onclick={() => { confirmDelete = !confirmDelete; editing = false; showQR = false; }}>
          <Trash2 size={15} />
        </Button>
      </div>
    </div>

    <!-- QR Panel -->
    {#if showQR}
      <div class="mt-4 flex flex-col items-center gap-3 rounded-lg bg-muted p-4">
        <div bind:this={qrContainer}>
          <SvgQR data={liveLink} {logo} width={180} height={180} class="rounded" />
        </div>
        <p class="break-all text-center text-xs text-muted-foreground">{liveLink}</p>
        <Button size="sm" onclick={downloadQR}>
          <Download size={14} class="mr-1.5" /> {$t("session-card.download-svg")}
        </Button>
      </div>
    {/if}

    <!-- Delete confirmation -->
    {#if confirmDelete}
      <div class="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-3">
        <p class="mb-3 text-sm font-medium text-destructive">{$t("session-card.delete-confirm")}</p>
        <div class="flex gap-2">
          <form method="POST" action="?/delete" use:enhance={() => async ({ update }) => { await update(); }}>
            <input type="hidden" name="id" value={session.id} />
            <Button type="submit" variant="destructive" size="sm">
              <Check size={13} class="mr-1" /> {$t("session-card.confirm")}
            </Button>
          </form>
          <Button variant="outline" size="sm" onclick={() => (confirmDelete = false)}>
            <X size={13} class="mr-1" /> {$t("session-card.cancel")}
          </Button>
        </div>
      </div>
    {/if}

    <!-- Edit form -->
    {#if editing}
      <form
        method="POST"
        action="?/update"
        class="mt-4 space-y-3"
        use:enhance={() => async ({ update }) => {
          await update();
          editing = false;
        }}>
        <input type="hidden" name="id" value={session.id} />
        <input type="hidden" name="schedule" value={JSON.stringify(buildSchedule())} />

        <div class="space-y-1">
          <Label for="edit-name-{session.id}">{$t("session-card.name")}</Label>
          <Input id="edit-name-{session.id}" name="name" bind:value={editName} required />
        </div>

        <div class="space-y-2">
          <Label>{$t("session-card.schedule")}</Label>
          <div class="flex gap-4 text-sm">
            <label class="flex cursor-pointer items-center gap-2">
              <input type="radio" bind:group={editType} value="recurring" /> {$t("session-card.recurring")}
            </label>
            <label class="flex cursor-pointer items-center gap-2">
              <input type="radio" bind:group={editType} value="once" /> {$t("session-card.once")}
            </label>
          </div>
          {#if editType === "recurring"}
            <select bind:value={editDay} class="w-full rounded-md border bg-background px-3 py-2 text-sm">
              {#each daysOfWeek as d}
                <option value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              {/each}
            </select>
          {:else}
            <Input type="date" bind:value={editDate} required />
          {/if}
        </div>

        <div class="flex gap-2">
          <Button type="submit" size="sm">
            <Check size={13} class="mr-1" /> {$t("session-card.save")}
          </Button>
          <Button type="button" variant="outline" size="sm" onclick={() => (editing = false)}>
            <X size={13} class="mr-1" /> {$t("session-card.cancel")}
          </Button>
        </div>
      </form>
    {/if}
  </CardContent>
</Card>
