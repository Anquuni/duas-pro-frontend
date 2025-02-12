<script lang="ts">
    import { Card, CardContent } from '$lib/components/ui/card';
	import { duaStore } from '$lib/stores/dua';
	import { settingsStore } from '$lib/stores/settings';
    import { onMount } from 'svelte';

    export let lines: DuaLine[];

    let headerHeight: number;
    let audioPlayerHeight: number;

    onMount(() => {
        const updateHeights = () => {
            const header = document.querySelector('header');
            const audioPlayer = document.querySelector('.audio-player'); // Annahme: Ihr Audioplayer hat diese Klasse
            headerHeight = header ? header.offsetHeight : 0;
            audioPlayerHeight = audioPlayer ? audioPlayer.offsetHeight : 0;
        };

        updateHeights();
        window.addEventListener('resize', updateHeights);

        return () => {
            window.removeEventListener('resize', updateHeights);
        };
    });
</script>

<div class="flex flex-col" style="height: calc(100vh - 30px - {audioPlayerHeight}px);">
    <Card class="flex-grow overflow-auto">
        <CardContent class="flex items-center justify-center h-full p-6">
            <div class="text-center space-y-4 max-w-2xl">
                <p class="font-arabic text-4xl mb-6">{lines[$duaStore.currentVerse][$settingsStore.primaryDuaLanguage]}</p>
                <p class="text-2xl italic mb-4">{lines[$duaStore.currentVerse][$settingsStore.secondaryDuaLanguage]}</p>
                <p class="text-xl">{lines[$duaStore.currentVerse][$settingsStore.tertiaryDuaLanguage]}</p>
            </div>
        </CardContent>
    </Card>
</div>