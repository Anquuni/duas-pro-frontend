import type { RealtimeChannel } from "@supabase/supabase-js";
import { writable } from "svelte/store";

interface LiveReadingState {
  duaRouteName: string | null;
  inLiveReadingRoom: boolean;
  liveReadingRoomCode: string | null;
  isHost: boolean;
  room: RealtimeChannel | null;
  participantsNumber: number;
  isHostOnline: boolean;
}

export const liveReadingStore = writable<LiveReadingState>({
  duaRouteName: null,
  inLiveReadingRoom: false,
  liveReadingRoomCode: null,
  isHost: false,
  room: null,
  participantsNumber: 0,
  isHostOnline: false,
});

export const howToLiveReadingDialogStore = writable<boolean>(false);
