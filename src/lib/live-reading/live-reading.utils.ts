import { duaStore } from "$lib/dua-detail/dua.store";
import { supabase } from "$lib/supabase.config";
import { toast } from "svelte-sonner";
import { howToLiveReadingDialogStore, liveReadingStore } from "./live-reading.store";

export function showNoLeaderToast() {
  toast.info("Nur der Leiter kann dies tun", {
    description:
      "Als Teilnehmer kannst du nicht zu einem anderen Vers springen. Diese Funktion ist exklusiv für den Leiter der Live-Lesung.",
    action: {
      label: "Mehr erfahren",
      onClick: () => howToLiveReadingDialogStore.set(true),
    },
  });
}

export function joinLiveReading(inputCode: string) {
  const code = inputCode.toUpperCase();
  console.log("Trying to connect to broadcast channel " + code);
  const channelA = supabase.channel(code);
  channelA
    .on("presence", { event: "sync" }, () => {
      const newState = channelA.presenceState<{ currentVerse: number }>();
      console.log("Presence Message erhalten: ", JSON.stringify(newState));
      const key = Object.keys(newState)[0]; // Holt den dynamischen Schlüssel
      if (key) {
        const newCurrentVerse = newState[key][0].currentVerse;
        duaStore.update((state) => ({
          ...state,
          currentVerse: newCurrentVerse,
        }));
      }
    })
    .subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }
      console.log("Subscribed to broadcast channel " + code);
      liveReadingStore.update((state) => ({
        ...state,
        isLiveReading: true,
        liveReadingCode: code,
      }));
    });

  liveReadingStore.update((state) => ({
    ...state,
    liveReadingCode: code,
    isLiveReading: true,
    leads: false,
  }));
}

export function startLiveReading() {
  const code = Math.random().toString(36).substring(7).toUpperCase();
  const channelB = supabase.channel(code);
  channelB.subscribe((status) => {
    if (status !== "SUBSCRIBED") {
      return;
    }
    console.log(`Erfolgreich im Channel ${code} subscribed.`);
    duaStore.subscribe((duaState) => {
      channelB.track({ currentVerse: duaState.currentVerse }).then((presenceTrackStatus) => {
        console.log(
          "Presence Message gesendet:" +
          duaState.currentVerse +
          " with response " +
          JSON.stringify(presenceTrackStatus),
        );
      });
    });
  });
  liveReadingStore.update((state) => ({
    ...state,
    liveReadingCode: code,
    isLiveReading: true,
    leads: true,
  }));
}

export function leftLiveReadingSession() {
  liveReadingStore.update((state) => ({
    ...state,
    liveReadingCode: null,
    isLiveReading: false,
    leads: false,
  }));
}
