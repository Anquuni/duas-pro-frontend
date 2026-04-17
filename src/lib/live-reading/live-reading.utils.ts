import { duaStore } from "$lib/dua-detail/dua.store";
import { supabase } from "$lib/supabase.config";
import { toast } from "svelte-sonner";
import { get } from "svelte/store";
import { howToLiveReadingDialogStore, liveReadingStore } from "./live-reading.store";
import { releaseWakeLock, requestWakeLock } from "$lib/dua-detail/wakeLock";

const verseChangedEvent = "verse-changed"

export function showNoHostToast() {
  toast.info("Nur der Host kann dies tun", {
    description:
      "Als Teilnehmer kannst du nicht zu einem anderen Vers springen. Diese Funktion ist exklusiv für den Host der Live-Lesung.",
    action: {
      label: "Mehr erfahren",
      onClick: () => howToLiveReadingDialogStore.set(true),
    },
  });
}

export async function joinLiveReadingRoom(inputCode: string) {
  await leaveLiveReadingRoom();
  const code = inputCode.toUpperCase();
  const participantChannel = supabase.channel(code);
  participantChannel
    .on("presence", { event: "sync" }, () => {
      const newState = participantChannel.presenceState<{ currentVerse: number, role: string }>();
      const hosts = Object.values(newState).flat().filter((p) => p.role === "host");
      liveReadingStore.update((state) => ({ ...state, participantsNumber: Object.values(newState).length, isHostOnline: hosts.length > 0 }));
    })
    .on('broadcast', { event: verseChangedEvent }, (message) => {
      duaStore.update((state) => ({ ...state, currentVerse: message.payload.currentVerse }));
    }).subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }
      requestWakeLock();

      // Notify channel that you as participant subsribed to the channel
      participantChannel.track({ role: "participant" })

      if (!get(liveReadingStore).inLiveReadingRoom) {
        liveReadingStore.update((state) => ({
          ...state,
          inLiveReadingRoom: true,
          liveReadingRoomCode: code,
          isHost: false,
          room: participantChannel,
        }));
      }
    });
}

export async function startLiveReadingRoom(code: string) {
  await leaveLiveReadingRoom()
  const hostChannel = supabase.channel(code);
  hostChannel
    .on('presence', { event: 'sync' }, () => {
      const newState = hostChannel.presenceState<{ currentVerse: number, role: string }>();
      liveReadingStore.update((state) => ({ ...state, participantsNumber: Object.values(newState).length }));
    })
    .subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        liveReadingStore.update((state) => ({ ...state, isHostOnline: false }))
        return;
      }
      liveReadingStore.update((state) => ({ ...state, isHostOnline: true }))
      requestWakeLock();
      hostChannel.track({ role: "host" })

      // Notify all participants of the initial state of the host
      hostChannel.send({ type: 'broadcast', event: verseChangedEvent, payload: { currentVerse: get(duaStore).currentVerse } })

      if (!get(liveReadingStore).inLiveReadingRoom) {
        // Notify all participants if the state of the host changes
        duaStore.subscribe((duaState) => {
          hostChannel.send({ type: 'broadcast', event: verseChangedEvent, payload: { currentVerse: duaState.currentVerse } })
        });

        liveReadingStore.update((state) => ({
          ...state,
          inLiveReadingRoom: true,
          liveReadingRoomCode: code,
          isHost: true,
          room: hostChannel,
          participantsNumber: 1,
        }));
      }
    });
}

export async function leaveLiveReadingRoom() {
  await releaseWakeLock();
  const liveReadingState = get(liveReadingStore);
  await liveReadingState.room?.untrack();
  await liveReadingState.room?.unsubscribe();
  liveReadingStore.update((state) => ({
    ...state,
    inLiveReadingRoom: false,
    liveReadingRoomCode: null,
    isHost: false,
    room: null,
  }));
}

export function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // No I, L, O, 0, 1
  let result = '';
  length = 5;
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}
