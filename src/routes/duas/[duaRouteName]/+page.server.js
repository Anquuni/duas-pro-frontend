// import { duaStore } from '$lib/stores/dua';
import { supabase } from '$lib/supabaseClient';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
    const { data, error } = await supabase.functions.invoke('duas/' + params.duaRouteName + '?languages=ar,tl,en');
	if (error) {
		console.error('Error fetching single dua:', error);
	}

	const sessionId = url.searchParams.get('sessionId');
	if (sessionId) {
		console.log("sessionId", sessionId);
		const channelA = supabase.channel(sessionId);
		channelA.on('broadcast', { event: 'test' }, (payload) => messageReceived(payload)).subscribe();
		console.log("subscribed to broadcast")
	}

    return {
		dua: data.data
	};
}

// @ts-expect-error Payload is never knwon
function messageReceived(payload) {
	console.log("received message " + JSON.stringify(payload))
	// duaStore.update((state) => ({ ...state, currentVerse: state.currentVerse - 1 }));
}
