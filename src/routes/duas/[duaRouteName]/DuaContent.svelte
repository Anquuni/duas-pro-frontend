<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import { Share2, Bookmark } from 'lucide-svelte';
	import type { Dua } from '../../../ambient';
	import { toast } from 'svelte-sonner';

    export let dua: Dua;
</script>

<div class="mb-12 text-center">
    <h1 class="font-arabic mb-2 text-4xl font-bold">{dua.title['AR']}</h1>
    <h2 class="mb-6 text-3xl">{dua.title['TL']}</h2>

    <div class="mb-4 flex items-center justify-center space-x-4">
        <!-- <Badge variant="secondary">{dua.category}</Badge> -->
        <Badge variant="secondary">Major Supplications</Badge>
        <Badge variant="outline">Forgiveness</Badge>
        <Badge variant="outline">Protection</Badge>
        <Badge variant="outline">Night Prayer</Badge>
        {#each dua.tags as tag}
            <Badge variant="outline">{tag}</Badge>
        {/each}
    </div>

    <p class="mb-6 text-sm text-gray-600">By Imam Ali</p>

    <!-- <p class="mx-auto mb-6 max-w-2xl text-gray-700">{dua.description['EN']}</p> -->
    <p class="mx-auto mb-6 max-w-2xl text-gray-700">
        The author of Mafatih al-Jinan, Shaykh Abbas al-Qummi (d. 1941 CE) says about this supplication: “This is one of the famous supplications. ʿAllāma al-Majlisī says that it is the best of all supplications, which ʾAmīr al-Muʾminīn Ali (a.s) taught to Kumayl, who was one of his select disciples. It is recited during nights of the middle of Sha'ban and every Thursday evening. It is useful for protecting against the evil of enemies, opening the gate of one's daily bread, and forgiving sins.
    </p>

    <div class="flex justify-center space-x-4">
        <Button variant="outline" size="sm" on:click={() => {
			toast.info("Noch nicht verfügbar!", {
				description: "Diese Funktion wird bald hinzugefügt. Unterstütze die Entwicklung und hilf uns, es schneller zu realisieren!",
				action: {
					label: "Unterstützen",
					onClick: () => console.info("Leite zur Unterstützungsseite weiter")
				}
			});
        }}>
            <Share2 class="mr-2 h-4 w-4" />
            Share
        </Button>
        <Button variant="outline" size="sm" on:click={() => {
			toast.info("Noch nicht verfügbar!", {
				description: "Diese Funktion wird bald hinzugefügt. Unterstütze die Entwicklung und hilf uns, es schneller zu realisieren!",
				action: {
					label: "Unterstützen",
					onClick: () => console.info("Leite zur Unterstützungsseite weiter")
				}
			});
        }}>
            <Bookmark class="mr-2 h-4 w-4" />
            Bookmark
        </Button>
    </div>
</div>