import { duaStore, type DuaState } from "$lib/dua-detail/dua.store";
import { supabase } from "$lib/supabase.config";
import type { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import { toast } from "svelte-sonner";
import { get } from "svelte/store";
import { howToLiveReadingDialogStore, liveReadingStore } from "./live-reading.store";
import { releaseWakeLock, requestWakeLock } from "$lib/dua-detail/wakeLock";

let hostUnsubscribe: (() => void) | null = null;

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
  console.log("Remove all channels");
  await supabase.removeAllChannels();
  const code = inputCode.toUpperCase();
  console.log("Participant tries to connect to channel " + code);
  const participantChannel = supabase.channel(code);
  participantChannel
    .on("presence", { event: "sync" }, () => {
      const newState = participantChannel.presenceState<{ currentVerse: number, role: string }>();
      console.log("Participant received message: ", JSON.stringify(newState));
      updateParticipantsNumber(newState);
      const hostEntry = Object.entries(newState).find(([_, presences]) =>
        presences.some((p) => p.role === "host")
      );
      if (hostEntry) {
        console.log("Host is online")
        const [hostKey, hostPresences] = hostEntry;
        const newCurrentVerse = hostPresences[0].currentVerse;
        duaStore.update((state) => ({
          ...state,
          currentVerse: newCurrentVerse,
        }));
        liveReadingStore.update((state) => ({ ...state, isHostOnline: true }))
      } else {
        console.log("Host is offline");
        liveReadingStore.update((state) => ({ ...state, isHostOnline: false }))
      }
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => handleJoinEvnt("Participant", newPresences))
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => handleLeaveEvent("Participant", leftPresences))
    .subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }
      console.log(`Participant subscribed to channel ${code}.`);
      requestWakeLock();

      participantChannel.track({role: "participant"}).then((presenceTrackStatus) => {
        console.log("Participant sent message with response " + JSON.stringify(presenceTrackStatus));
      });

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
  console.log("Remove all channels");
  await supabase.removeAllChannels();
  console.log("Host tries to connect to channel " + code);
  const hostChannel = supabase.channel(code);
  hostChannel
    .on('presence', { event: 'sync' }, () => {
      const newState = hostChannel.presenceState<{ currentVerse: number, role: string }>();
      console.log("Host received message: ", JSON.stringify(newState));
      updateParticipantsNumber(newState);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => handleJoinEvnt("Host", newPresences))
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => handleLeaveEvent("Host", leftPresences))
    .subscribe((status) => {
      console.log("Host received subscribe event with " + status);

      if (status !== "SUBSCRIBED") {
        liveReadingStore.update((state) => ({ ...state, isHostOnline: false }))
        return;
      }
      liveReadingStore.update((state) => ({ ...state, isHostOnline: true }))
      console.log(`Host subscribed to channel ${code}.`);
      requestWakeLock();

      // Notify all participants of the initial state of the host
      syncHostState(hostChannel, get(duaStore));

      if (hostUnsubscribe) {
        console.log("unsibscireb")
        hostUnsubscribe();
      }

      if (!get(liveReadingStore).inLiveReadingRoom) {
        console.log("subscribe")
        // Notify all participants if the state of the host changes
        hostUnsubscribe = duaStore.subscribe((duaState) => syncHostState(hostChannel, duaState));
        console.log("Host subscribed to duaStore")

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

function handleJoinEvnt(s: string, presences: RealtimePresenceState<{ [key: string]: any;  }>[]) {
  console.log(s, ' received join event of ... ', JSON.stringify(presences));
  const isHost = presences.some(p => (p as any).role === "host");
  if (!isHost) {
    console.log(' ... a participant');
    const participantsNumber = get(liveReadingStore).participantsNumber + 1;
    liveReadingStore.update((state) => ({ ...state, participantsNumber }));
    console.log("New participantsNumber: " + participantsNumber);
  }
}

function handleLeaveEvent(s: string, presences: RealtimePresenceState<{ [key: string]: any; }>[]) {
  console.log(s, ' received leave event of ... ', JSON.stringify(presences));
  const isHost = presences.some(p => (p as any).role === "host");
  if (!isHost) {
    console.log(' ... a participant');
    const participantsNumber = get(liveReadingStore).participantsNumber - 1;
    liveReadingStore.update((state) => ({ ...state, participantsNumber }));
    console.log("New participantsNumber: " + participantsNumber);
  }
}

function syncHostState(channel: RealtimeChannel, duaState: DuaState) {
  console.log("syncHostState called with verse", duaState.currentVerse, "at", Date.now());
  channel.track({ currentVerse: duaState.currentVerse, role: "host" }).then((presenceTrackStatus) => {
    console.log("Host sent message with " + duaState.currentVerse + " and with response " + JSON.stringify(presenceTrackStatus));
  });
}

function updateParticipantsNumber(state: RealtimePresenceState<{ currentVerse: number }>) {
  const participantsNumber = Object.values(state)
    .length;
  liveReadingStore.update((state) => ({ ...state, participantsNumber }));
  console.log("New participantsNumber: " + participantsNumber);
}

export function leaveLiveReadingRoom() {
  releaseWakeLock();
  const liveReadingState = get(liveReadingStore);
  liveReadingState.room?.untrack();
  liveReadingState.room?.unsubscribe()
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
