<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { User, Share2, Bookmark } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Dua } from '../../ambient';

	export let dua: Dua;
	const isPopular = dua.tags.includes('popular');
	const isRecommendedToday = dua.tags.includes('daily');

	function shareDua(id: string) {
		console.log(`Sharing dua ${id}`);
		// Implement sharing functionality here
	}

	function bookmarkDua(id: string) {
		console.log(`Sharing dua ${id}`);
		// Implement sharing functionality here
	}

	function handleAction(event: Event, action: () => void) {
		event.preventDefault();
		event.stopPropagation();
		action();
	}
</script>

<a href="/duas/{dua.route_name}" class="block">
	<Card class="relative overflow-hidden transition-shadow hover:shadow-lg">
		{#if isPopular || isRecommendedToday}
			<Badge class="absolute right-2 top-2 z-20">
				{isPopular ? 'Popular' : 'Recommended Today'}
			</Badge>
		{/if}
		<CardHeader
			class={cn(
				'relative bg-cover bg-center pt-8',
				"before:absolute before:inset-0 before:z-10 before:bg-black/50 before:content-['']"
			)}
			style="background-image: url({dua.image_url});"
		>
			<div class="relative z-20 flex items-start justify-between">
				<div>
					<CardTitle class="text-xl font-semibold text-white">{dua.title['TL']}</CardTitle>
					<CardDescription class="text-sm text-gray-200">{dua.title['EN']}</CardDescription>
				</div>
				<CardTitle class="font-arabic text-right text-2xl text-white">{dua.title['AR']}</CardTitle>
			</div>
		</CardHeader>
		<CardContent class="pt-4">
			<p class="mb-2 text-sm text-muted-foreground">
				<!-- {dua.description['en'] || 'No description available'} -->
				A powerful prayer known for seeking forgiveness and protection.
			</p>
			{#if dua.narratedBy['EN'] !== null}
				<div class="mt-2 flex items-center justify-between">
					<p class="text-xs font-semibold text-primary">Major Supplications</p>
					<div class="flex items-center text-xs text-muted-foreground">
						<User size={14} class="mr-1" />
						<span>{dua.narratedBy['EN']}</span>
					</div>
				</div>
			{/if}
		</CardContent>
		<CardFooter class="flex items-center justify-between">
			<Button variant="outline" size="sm">Read Full Dua</Button>
			<div class="flex space-x-2">
				<Button
					variant="ghost"
					size="icon"
					on:click={(e) => handleAction(e, () => shareDua(dua.route_name))}
				>
					<Share2 size={20} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					on:click={(e) => handleAction(e, () => bookmarkDua(dua.route_name))}
				>
					<Bookmark size={20} />
				</Button>
			</div>
		</CardFooter>
	</Card>
</a>