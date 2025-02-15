import { writable } from "svelte/store";

export interface DuaState {
  currentView: string;
  currentVerse: number;
}

export const duaStore = writable<DuaState>({
  currentView: "translation",
  currentVerse: 0,
});
