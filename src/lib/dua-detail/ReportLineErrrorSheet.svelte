<script lang="ts">
  import { languages, settingsStore } from "$lib/settings/settings.store";
  import { AlertOctagon } from "@lucide/svelte";
  import { enhance } from "$app/forms";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Input } from "$lib/components/ui/input";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import * as Sheet from "$lib/components/ui/sheet/index.js";

  let { duaSlug, line, lineNumber, user } = $props();
  let open = $state(false);
  let email = $state(user?.email ?? "");
  let errorDescription = $state("");
  let formState: { success: boolean; missing: boolean; error: string } | undefined = $state(undefined);

  let languageLabel = $derived(languages.find((l) => l.value === $settingsStore.systemLanguage)?.label);
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger>
    <button aria-label="Vers bearbeiten" class="text-neutral-600 hover:text-primary dark:text-neutral-200">
      <AlertOctagon class="h-4 w-4" />
    </button>
  </Sheet.Trigger>
  <Sheet.Content side="right" class="p-6">
    <Sheet.Title class="text-2xl font-bold">Fehler melden</Sheet.Title>

    <form
      action="?/reportLineError"
      method="POST"
      use:enhance={({ formElement, formData, action, cancel, submitter }) => {
        return async ({ result, update }) => {
          if (result.type === "success") {
            toast.success("🤲 Danke, dein Hinweis ist angekommen!", {
              description: "Dein Beitrag hilft, die Übersetzungen für alle zu verbessern.",
            });
            open = false;
            formState = undefined;
            errorDescription = "";
          } else {
            formState = result.data;
          }
        };
      }}
      class="space-y-4">
      <input type="hidden" name="duaSlug" value={duaSlug} />
      <input type="hidden" name="lang" value={$settingsStore.systemLanguage} />
      <input type="hidden" name="lineNumber" value={lineNumber} />

      <p class="text-sm text-neutral-600 dark:text-neutral-100">
        Entdeckst du einen Fehler oder hast du eine bessere Übersetzung? Sag uns Bescheid!
      </p>

      <!-- <div>
        <p class="text-sm text-neutral-600 dark:text-neutral-100">Arabisch:</p>
        <p class="arabic-font text-2xl">{line["ar"]}</p>
      </div>

      <div>
        <p class="text-sm text-neutral-600 dark:text-neutral-100">Transliteration:</p>
        <p>{line["translit"]}</p>
      </div>

      <div>
        <p class="text-sm text-neutral-600 dark:text-neutral-100">
          Übersetzung in {languageLabel}:
        </p>
        <p>{line[$settingsStore.systemLanguage]}</p>
      </div> -->

      <!-- Editierbarer Text in System-Sprache -->
      <div>
        <Label for="errorDescription" class="text-sm font-medium">📝 Fehler oder Vorschlag</Label>
        <Textarea
          id="errorDescription"
          name="errorDescription"
          bind:value={errorDescription}
          placeholder="z.B. „Das Wort x klingt unklar“ oder „Hier fehlt ein Satz y.“" />
        {#if formState?.missing}<p class="text-sm text-red-600">Bitte gib eine kurze Beschreibung ein.</p>{/if}
      </div>

      <!-- Email-Feld -->
      <div>
        <Label for="email" class="text-sm font-medium">
          📧 Deine E-Mail {#if !user}(optional){/if}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          bind:value={email}
          disabled={user !== null && user !== undefined}
          placeholder="your.email@example.com" />
      </div>

      <p class="text-sm text-neutral-600 dark:text-neutral-100">
        Wenn du willst, sagen wir dir innerhalb von 24 Stunden per E-Mail Bescheid, ob dein Vorschlag übernommen wurde.
      </p>

      <Button type="submit" class="mt-6 w-full rounded-none">Fehler melden</Button>
      {#if formState}
        {#if formState.success === false}<p class="text-sm text-red-600">
            Uups, da ist was schiefgelaufen. Bitte versuch es nochmal.<br />
            Fehler: {formState.error}
          </p>{/if}
      {/if}
    </form>
  </Sheet.Content>
</Sheet.Root>
