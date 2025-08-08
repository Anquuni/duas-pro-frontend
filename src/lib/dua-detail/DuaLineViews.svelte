<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { duaStore } from "$lib/dua-detail/dua.store";
  import DuaPresentationView from "$lib/dua-detail/views/DuaPresentationView.svelte";
  import DuaReadingView from "$lib/dua-detail/views/DuaReadingView.svelte";
  import DuaTranslationView from "$lib/dua-detail/views/DuaTranslationView.svelte";
  import { t } from "$lib/translations/i18n";
  import { Book, Languages, Presentation } from "@lucide/svelte";

  let { dua, user } = $props();

  function setActiveTab(tab: string | undefined) {
    if (tab) {
      duaStore.update((state) => ({ ...state, currentTab: tab }));
    }
  }
</script>

<Tabs class="w-full" bind:value={$duaStore.currentView} onValueChange={setActiveTab}>
  <TabsList class="grid w-full grid-cols-3">
    <TabsTrigger value="translation" class="flex items-center justify-center">
      <Languages class="mx-1 h-5 w-5" />
      {$t("dua.views.translation")}
    </TabsTrigger>
    <TabsTrigger value="reading" class="flex items-center justify-center">
      <Book class="mx-1 h-5 w-5" />
      {$t("dua.views.reading")}
    </TabsTrigger>
    <TabsTrigger value="presentation" class="flex items-center justify-center">
      <Presentation class="mx-1 h-5 w-5" />
      {$t("dua.views.presentation")}
    </TabsTrigger>
  </TabsList>
  <TabsContent value="translation">
    <DuaTranslationView duaSlug={dua.slug} lines={dua.lines} currentVerseIndex={$duaStore.currentVerse} {user} />
  </TabsContent>
  <TabsContent value="reading">
    <DuaReadingView lines={dua.lines} currentVerseIndex={$duaStore.currentVerse} />
  </TabsContent>
  <TabsContent value="presentation">
    <DuaPresentationView lines={dua.lines} />
  </TabsContent>
</Tabs>
