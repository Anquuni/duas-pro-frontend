<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { settingsStore } from '$lib/stores/settings';
	import type { DuaLine } from '../../../ambient';

	export let lines: DuaLine[];
	export let currentVerseIndex: number;
</script>

<div class="flex justify-center">
	<Card class="w-full max-w-5xl">
		<CardContent class="p-6">
			<div class="font-arabic text-right text-xl leading-loose">
				{#each lines as line, index}
					{#if line.begin_of_section && index !== 0}
						<div class="my-1"></div>
					{/if}
					<span
						id="verse-{index}"
						class="primary-dua-font-size verse-span {index === currentVerseIndex ? 'current-verse' : ''}"
					>
						{line[$settingsStore.primaryDuaLanguage]}
					</span>
				{/each}
			</div>
		</CardContent>
	</Card>
</div>

<style>
	.font-arabic {
		font-family: 'Amiri', serif;
	}
    .verse-span {
        transition: background-color 0.3s ease;
    }

    .current-verse {
        background-color: rgba(0, 0, 0, 0.1); /* Leichter grauer Hintergrund */
        padding: 2px 4px;
        border-radius: 4px;
    }
</style>
