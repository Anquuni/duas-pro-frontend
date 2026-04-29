<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "$lib/components/ui/dialog";
  import { settingsStore } from "$lib/settings/settings.store";
  import { daysOfWeek, type SessionSchedule } from "./session.model";
  import { CalendarPlus } from "@lucide/svelte";

  let { dua } = $props();

  let open = $state(false);
  let name = $state(dua.title["translit"] ?? "");
  let scheduleType = $state<"once" | "recurring">("recurring");
  let date = $state("");
  let day = $state("thursday");
  let submitting = $state(false);
  let errorMsg = $state("");

  const profileUrl = $derived(`/${$settingsStore.systemLanguage}/profile`);
  const actionUrl = $derived(`/${$settingsStore.systemLanguage}/profile?/create`);

  function buildSchedule(): SessionSchedule {
    if (scheduleType === "once") return { type: "once", date };
    return { type: "recurring", day: day as typeof daysOfWeek[number] };
  }
</script>

<Dialog bind:open>
  <DialogTrigger>
    <Button variant="outline" size="sm">
      <CalendarPlus size={16} class="mr-1.5" />
      Plan Live Reading
    </Button>
  </DialogTrigger>

  <DialogContent class="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Plan a Live Reading Session</DialogTitle>
      <DialogDescription>
        Schedule a live reading of <strong>{dua.title["translit"]}</strong>. A unique code will be generated that participants can use to join.
      </DialogDescription>
    </DialogHeader>

    <form
      method="POST"
      action={actionUrl}
      class="space-y-4"
      use:enhance={() => {
        submitting = true;
        errorMsg = "";
        return async ({ result }) => {
          submitting = false;
          if (result.type === "success") {
            open = false;
            await goto(profileUrl);
          } else if (result.type === "failure") {
            errorMsg = (result.data as any)?.error ?? "Something went wrong.";
          }
        };
      }}>
      <input type="hidden" name="dua_slug" value={dua.slug} />
      <input type="hidden" name="dua_title" value={JSON.stringify(dua.title)} />
      <input type="hidden" name="schedule" value={JSON.stringify(buildSchedule())} />

      <div class="space-y-1">
        <Label for="cs-name">Session Name</Label>
        <Input
          id="cs-name"
          name="name"
          bind:value={name}
          placeholder="e.g. Thursday Dua Kumayl"
          required />
      </div>

      <div class="space-y-2">
        <Label>Schedule</Label>
        <div class="flex gap-4 text-sm">
          <label class="flex cursor-pointer items-center gap-2">
            <input type="radio" bind:group={scheduleType} value="recurring" />
            Recurring
          </label>
          <label class="flex cursor-pointer items-center gap-2">
            <input type="radio" bind:group={scheduleType} value="once" />
            One-time
          </label>
        </div>
        {#if scheduleType === "recurring"}
          <select bind:value={day} class="w-full rounded-md border bg-background px-3 py-2 text-sm">
            {#each daysOfWeek as d}
              <option value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            {/each}
          </select>
        {:else}
          <Input type="date" bind:value={date} required />
        {/if}
      </div>

      {#if errorMsg}
        <p class="text-sm text-destructive">{errorMsg}</p>
      {/if}

      <div class="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create & Go to Profile"}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
