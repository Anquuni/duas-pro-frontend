<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import { duaStore } from '$lib/stores/dua';
	import type { Dua, DuaRecitationDetail } from '../../../ambient';
	import { Button } from '$lib/components/ui/button';
	import { SkipBack, Pause, Play, SkipForward, Ellipsis, Eye, EyeOff } from 'lucide-svelte';
	import AudioSettingsPopover from './AudioSettingsPopover.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { toast } from "svelte-sonner";

	export let dua: Dua;	

	let audioData: DuaRecitationDetail;
	let audio: HTMLAudioElement | null = null;
	let currentTime = 0;
	let duration = 0;
	let playbackRate = 1.0;
	let currentReciter: string | null = null;
	let isPlaying = false;
	let isSettingsOpen = false;
	let isHidden = false;

	const totalVerses = dua.lines.length;
	const hasNoRecitations = dua.recitations.length === 0;
	const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

	const reciters = dua.recitations.map(rec => rec.reciters);
	if (reciters.length > 0) {
		currentReciter = reciters[0].full_name_tl;
	}

	function formatTime(timeInSeconds: number): string {
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = Math.floor(timeInSeconds % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	function setPlaybackRate(rate: number) {
		playbackRate = rate;
		if (audio) {
			audio.playbackRate = rate;
		}
	}

	function setReciter(reciter: string) {
		if (reciter !== currentReciter) {
			currentReciter = reciter;
			if (isPlaying) {
				togglePlay();
			}
			audio = null;
			togglePlay();
		}
	}

	function handleSliderChange(value: number[]) {
		const newVerseIndex = value[0];
		duaStore.update((state) => ({ ...state, currentVerse: newVerseIndex }));
		seekToVerse(newVerseIndex);
	}

	function updateProgress() {
		const currentTime = audio!.currentTime * 1000; // Convert to milliseconds
		for (let i = totalVerses; i >= 0; i--) {
			if (currentTime >= audioData.startTimes[i]) {
				// Avoid updating value if same to be able to scroll to other verses while playing
				if ($duaStore.currentVerse !== i) {
					duaStore.update((state) => ({ ...state, currentVerse: i }));
				}
				break;
			}
		}
	}

	function seekToVerse(verseIndex: number) {
		if (audioData) {
			audio!.currentTime = audioData.startTimes[verseIndex] / 1000; // Convert to seconds
		}
	}

	async function fetchAudio() {
		if (!currentReciter) return;
		const selectedRecitation = dua.recitations.find(
			rec => rec.reciters?.full_name_tl === currentReciter
		);

		if (!selectedRecitation) {
			console.error("Kein passender Reciter gefunden");
			return;
		}

		const { data, error } = await supabase.functions.invoke('audios/' + selectedRecitation.uuid);
		audioData = data.data;
		if (data.data.audio_high_quality_url) {
			audio = new Audio(data.data.audio_high_quality_url);
			audio.playbackRate = playbackRate;
			audio.addEventListener('timeupdate', () => {
				currentTime = audio!.currentTime;
				updateProgress();
			});
			audio.addEventListener('loadedmetadata', () => {
				duration = audio!.duration;
			});
			audio.addEventListener('ended', () => {
				isPlaying = false;
			});
		}	
	}

	async function showNoAudioNotification() {
		toast.info("No audio found!", {
				description: "Upload an audio file to start playing.",
				action: {
					label: "Upload",
					onClick: () => console.info("Open upload modal")
				}
			});
	}

	async function togglePlay() {
		if (hasNoRecitations) {
			showNoAudioNotification();
			return;
		}
		if (!audio) {
			await fetchAudio();
		}

		if (isPlaying) {
			audio?.pause();
		} else {
			audio?.play();
		}
		isPlaying = !isPlaying;
	}

	function previousVerse() {
		if ($duaStore.currentVerse > 0) {
			duaStore.update((state) => ({ ...state, currentVerse: state.currentVerse - 1 }));
			seekToVerse($duaStore.currentVerse);
		}
	}

	function nextVerse() {
		if ($duaStore.currentVerse < totalVerses - 1) {
			duaStore.update((state) => ({ ...state, currentVerse: state.currentVerse + 1 }));
			seekToVerse($duaStore.currentVerse);
		}
	}

	function toggleHidden() {
		isHidden = !isHidden;

		// Join a room/topic. Can be anything except for 'realtime'.
		const channelB = supabase.channel('mahdi')

		channelB.subscribe((status) => {
		// Wait for successful connection
		if (status !== 'SUBSCRIBED') {
			return null
		}

		// Send a message once the client is subscribed
		channelB.send({
			type: 'broadcast',
			event: 'test',
			payload: { message: 'hello, world' },
		})
		console.log("send broadcast message")
		})

	}
</script>

<!-- <div class="audio-player h-[50px] fixed bottom-0 left-0 right-0 bg-background"> -->
<div class="fixed bottom-0 left-0 right-0 transition-transform duration-300"
	class:translate-y-[55px]={isHidden}>
<div class="audio-player bg-background relative">
	<!-- Toggle Button -->
	<button 
		class="fixed bg-primary bottom-[60px] h-8 right-4 flex items-center space-x-2 bg-gray-700 text-white px-2 py-1 rounded-full shadow-md text-sm"
		on:click={toggleHidden}>
		{#if isHidden}
			<Eye class="h-4 w-4" /> <span>Show</span>
		{:else}
			<EyeOff class="h-4 w-4" /> <span>Hide</span>
		{/if}
	</button>

	<div class="h-[50px]">
		<div class="px-4">
			<Slider
				onValueChange={handleSliderChange}
				value={[$duaStore.currentVerse]}
				max={totalVerses - 1}
				step={1}
				class="w-full"
			/>
		</div>
		<div class="flex items-center justify-between px-4">
			<span class="text-sm text-gray-500">{isPlaying || currentTime > 0 ? formatTime(currentTime) : '--:--'}</span>
			<div class="flex items-center space-x-0 md:space-x-4">
				<Button variant="ghost" on:click={previousVerse}>
					<SkipBack class="h-5 w-5" />
				</Button>
				<Button variant="ghost" on:click={togglePlay}>
					{#if isPlaying}
						<Pause class="h-5 w-5" />
					{:else}
						<Play class="h-5 w-5" />
					{/if}
				</Button>
				<Button variant="ghost" on:click={nextVerse}>
					<SkipForward class="h-5 w-5" />
				</Button>
				<div class="relative">
					<Button variant="ghost" on:click={() => {
						if (!hasNoRecitations) {
							isSettingsOpen = !isSettingsOpen
						} else {
							showNoAudioNotification();
						}
					}}>
						<Ellipsis class="h-5 w-5" />
					</Button>
					{#if isSettingsOpen}
						<AudioSettingsPopover 
							{playbackRate}
							{currentReciter}
							{speeds}
							{reciters}
							on:setPlaybackRate={(e) => setPlaybackRate(e.detail)}
							on:setReciter={(e) => setReciter(e.detail)}
							on:close={() => isSettingsOpen = false}
						/>
					{/if}
				</div>
			</div>
			<span class="text-sm text-gray-500">{duration > 0 ? formatTime(duration) : '--:--'}</span>
		</div>
	</div>
</div>
</div>