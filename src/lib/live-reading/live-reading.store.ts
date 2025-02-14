import { writable } from "svelte/store";

interface LiveReadingState {
  duaRouteName: string;
  isLiveReading: boolean;
  liveReadingCode: string | null;
  leads: boolean;
}

export const liveReadingStore = writable<LiveReadingState>({
  duaRouteName: "",
  isLiveReading: false,
  liveReadingCode: "",
  leads: false,
});

export const howToLiveReadingDialogStore = writable<boolean>(false);
