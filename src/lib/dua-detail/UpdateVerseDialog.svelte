<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
  import { settingsStore } from "$lib/settings/settings.store";
  import { Pencil } from "@lucide/svelte";

  let { line, user, supabase } = $props();
  let open = $state(false);
  let saving = $state(false);
  let isBeginOfSection = $state(line.begin_of_section);
  let isInstruction = $state(line.type === "INSTRUCTION");

  // Speichern in Supabase
  async function handleSave() {
    if (line.type !== isInstruction || line.begin_of_section !== isBeginOfSection) {
      saving = true;
      console.log("isInstruction " + isInstruction);
      console.log("begin_of_section " + isBeginOfSection);
      const { error } = await supabase
        .from("dua_lines")
        .update({
          type: isInstruction ? "INSTRUCTION" : "SUPPLICATION",
          begin_of_section: isBeginOfSection,
        })
        .eq("id", line.id);

      if (error) {
        console.error("Supabase Error:", error);
        alert("Speichern fehlgeschlagen");
      } else {
        // Dialog schließen und ggf. Parent neu laden
        open = false;
        // z.B. dispatchEvent oder invalidate
      }
    }
  }
</script>

{#if user}
  <Dialog bind:open={open}>
    <DialogTrigger>
      <button aria-label="Vers bearbeiten" class="text-gray-600 hover:text-primary dark:text-gray-300">
        <Pencil class="h-4 w-4" />
      </button>
    </DialogTrigger>

    <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold">Vers bearbeiten</DialogTitle>
      </DialogHeader>

      <form onsubmit={handleSave} class="space-y-4 mt-2">
        <!-- Arabischer Vers (readonly) -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Arabisch</label>
          <p class="mt-1 font-arabic text-lg leading-relaxed">{line["ar"]}</p>
        </div>

        <!-- Transliteration (readonly) -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Transliteration</label>
          <p class="mt-1 text-sm">{line["translit"]}</p>
        </div>

        <!-- Editierbarer Text in System-Sprache -->
        <div>
          <label for="sysText" class="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
            {$settingsStore.systemLanguage.toUpperCase()} Text
          </label>
          <textarea
            id="sysText"
            bind:value={line[$settingsStore.systemLanguage]}
            rows="3"
            class="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-transparent
                   focus:border-primary focus:ring-primary sm:text-sm"></textarea>
        </div>

        <!-- Checkbox: Anweisung statt Dua -->
        <div class="flex items-center space-x-2">
          <input
            id="instruction"
            type="checkbox"
            bind:checked={isInstruction}
            class="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary" />
          <label for="instruction" class="text-sm text-neutral-700 dark:text-neutral-200">
            Diese Zeile ist eine Anweisung
          </label>
        </div>

        <!-- Checkbox: Absatz nach Vers -->
        <div class="flex items-center space-x-2">
          <input
            id="paragraph"
            type="checkbox"
            bind:checked={isBeginOfSection}
            class="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary" />
          <label for="paragraph" class="text-sm text-neutral-700 dark:text-neutral-200">
            Absatz mit diesem Vers
          </label>
        </div>

        <!-- Action-Buttons -->
        <div class="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onclick={() => (open = false)}
            class="rounded-md px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200
                   hover:bg-neutral-100 dark:hover:bg-neutral-700">
            Abbrechen
          </button>
          <button
            type="submit"
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            Speichern
          </button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
{/if}
