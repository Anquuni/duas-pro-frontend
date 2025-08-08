<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
  import { languages, settingsStore } from "$lib/settings/settings.store";
  import { AlertOctagon } from "@lucide/svelte";
  import { enhance } from "$app/forms";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Input } from "$lib/components/ui/input";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";

  let { duaSlug, line, lineNumber, user, form } = $props();
  let open = $state(false);
  let email = $state(user?.email ?? "");
  let errorDescription = $state("");

  let languageLabel = $derived(languages.find(l => l.value === $settingsStore.systemLanguage)?.label);

  const onSuccess = () => {
    // setTimeout(() => {
      open = false;
    // console.log("set to undefined")
    //   formState = undefined;
    //   errorDescription = "";
    //   email = user?.email ?? "";
    // }, 3000);
    toast.success("Meldung ist erfolgreich eingegangen!", {
      description:
        "...",
    });
  };

  // $effect(() => {
  //   if (open) {
  //     console.log("hier?")
  //     errorDescription = "";
  //     email = user?.email ?? "";
  //     formState = undefined;
  //   }
  // })
</script>

<Dialog bind:open>
  <DialogTrigger>
    <button aria-label="Vers bearbeiten" class="hover:text-primary text-neutral-600 dark:text-neutral-200">
      <AlertOctagon class="h-4 w-4" />
    </button>
  </DialogTrigger>

  <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle class="text-2xl font-bold">Übersetzungsfehler melden</DialogTitle>
    </DialogHeader>

    <form action="?/reportLineError" method="POST" use:enhance={onSuccess} class="space-y-4">
      <input type="hidden" name="duaSlug" value={duaSlug} />
      <input type="hidden" name="lang" value={$settingsStore.systemLanguage} />
      <input type="hidden" name="lineNumber" value={lineNumber} />

      <p class="text-sm text-neutral-600 dark:text-neutral-100">
        Mit diesem Formular kannst du Übersetzungsfehler melden oder Verbesserungsvorschläge einreichen.
      </p>

      <!-- Arabischer Vers (readonly) -->
      <div>
        <p class="text-sm text-neutral-600 dark:text-neutral-100">Arabisch:</p>
        <p class="arabic-font text-2xl">{line["ar"]}</p>
      </div>

      <!-- Transliteration (readonly) -->
      <div>
        <p class="text-sm text-neutral-600 dark:text-neutral-100">Transliteration:</p>
        <p>{line["translit"]}</p>
      </div>

      <!-- Transliteration (readonly) -->
      <div>
        <p class="text-sm text-neutral-600 dark:text-neutral-100">
          Übersetzung in {languageLabel}:
        </p>
        <p>{line[$settingsStore.systemLanguage]}</p>
      </div>

      <!-- Editierbarer Text in System-Sprache -->
      <div>
        <Label for="errorDescription" class="text-sm font-medium">
          Übersetzungsfehler oder Verbesserungsvorschlag
        </Label>
        <Textarea
          id="errorDescription"
          name="errorDescription"
          bind:value={errorDescription} placeholder="Gib hier deine Beschreibung ein." />
      </div>


      <!-- Email-Feld -->
      <div>
        <Label for="email" class="text-sm font-medium">
          E-Mail {#if !user}(optional){/if}
        </Label>
        <Input
          id="email"
          type="email"
          bind:value={email}
          disabled={user !== null && user !== undefined}
          placeholder="your.email@example.com" />
      </div>

      <!-- Hinweis zur Prüfung -->
      <p class="text-sm text-neutral-600 dark:text-neutral-100">
        Wir prüfen deine Meldung innerhalb von 24 Stunden. Wenn deine Korrektur oder dein Vorschlag angenommen wurde, erhältst du eine E-Mail.
      </p>

      <!-- Action-Buttons -->
      <div class="mt-6 flex justify-end space-x-2">
        <Button
        variant="ghost"
          onclick={() => (open = false)}>
          Abbrechen
        </Button>
        <Button type="submit">Speichern</Button>
      </div>
      {#if form}
        {#if form.missing}<p class="text-sm text-red-600">Die Beschreibung ist erforderlich.</p>{/if}
        {#if form.success}<p class="text-sm text-green-600 ">Meldung wurde gesendet! Vielen Dank!</p>{/if}
        {#if form.success === false}<p class="text-sm text-red-600 ">Das hat leider nicht funktioniert. Versuche es später erneut.<br />
          Fehler: {form.error}</p>{/if}
      {/if}
    </form>
  </DialogContent>
</Dialog>
