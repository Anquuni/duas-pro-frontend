import { writable } from "svelte/store";

interface HeaderState {
  isDuaPage: boolean;
  duaTitle?: string;
  showViewTabs: boolean;
  isExpandedHeader: boolean;
}

export const headerStore = writable<HeaderState>({
  isDuaPage: false,
  duaTitle: undefined,
  showViewTabs: false,
  isExpandedHeader: true,
});
