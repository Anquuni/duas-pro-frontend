<!-- TODO: Add buttons for each verse:
        - Play beginning with the selected verse
        - Share 
        - Bookmark
        - Copy arabic text of verse
        - Copy link to the specific verse
     -->
<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { settingsStore } from '$lib/stores/settings';
	import { Bookmark, BookOpen, Redo, Share2, Trash } from 'lucide-svelte';
	import type { DuaLine } from '../../../ambient';
	import { duaStore } from '$lib/stores/dua';
	import { toast } from 'svelte-sonner';
	import { showNoLeaderToast } from '$lib/live-reading/live-reading.utils';
	import { liveReadingStore } from '$lib/live-reading/live-reading.store';

	export let line: DuaLine;
	export let index: number;
	export let currentVerseIndex: number;

	let isInstruction = line.type === "INSTRUCTION";
</script>


<div class="verse-span flex justify-center" id="verse-{index}">
	<Card
	  class="w-full max-w-5xl transition-colors duration-300 ease-in-out {
		index === currentVerseIndex ? 'bg-gray-300 dark:bg-gray-800' : ''
	  } {
		isInstruction ? 'border-l-4 border-tertiary' : ''
	  }"
	>
	  <CardContent class="p-2">
		<div class="text-center">
		  <div class="mb-1 flex items-center justify-center space-x-2">
			<span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold {
			  isInstruction 
				? 'bg-tertiary/10 text-tertiary dark:bg-tertiary/20 dark:text-tertiary-foreground'
				: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
			}">
			  {#if isInstruction}
				<BookOpen class="mr-1 h-3 w-3" />
			  {/if}
			  {index + 1}
			</span>
			
			<button class="text-gray-600 dark:text-gray-300"
			  on:click={() => {
				if ($liveReadingStore.isLiveReading && !$liveReadingStore.leads) {
					showNoLeaderToast()
				} else {
					duaStore.update((state) => ({ ...state, currentVerse: index }))
				}
			  }}>
			  <Redo class="h-4 w-4" />
			</button>
			
			<button class="text-gray-600 dark:text-gray-300"
			  on:click={() => {
				toast.info("Noch nicht verfügbar!", {
				  description: "Diese Funktion wird bald hinzugefügt. Unterstütze die Entwicklung und hilf uns, es schneller zu realisieren!",
				  action: {
					label: "Unterstützen",
					onClick: () => console.info("Leite zur Unterstützungsseite weiter")
				  }
				});
			  }}>
			  <Share2 class="h-4 w-4" />
			</button>
			
			<button class="text-gray-600 dark:text-gray-300"
			  on:click={() => {
				toast.info("Noch nicht verfügbar!", {
				  description: "Diese Funktion wird bald hinzugefügt. Unterstütze die Entwicklung und hilf uns, es schneller zu realisieren!",
				  action: {
					label: "Unterstützen",
					onClick: () => console.info("Leite zur Unterstützungsseite weiter")
				  }
				});
			  }}>
			  <Bookmark class="h-4 w-4" />
			</button>
		  </div>
		  
		  <div class="space-y-2 {
			isInstruction 
			  ? 'text-tertiary-800 dark:text-tertiary-200' 
			  : ''
		  }">
			<p class="primary-dua-font-size">{line[$settingsStore.primaryDuaLanguage]}</p>
			<p class="secondary-dua-font-size">{line[$settingsStore.secondaryDuaLanguage]}</p>
			<p class="tertiary-dua-font-size">{line[$settingsStore.tertiaryDuaLanguage]}</p>
		  </div>
		</div>
	  </CardContent>
	</Card>
  </div>