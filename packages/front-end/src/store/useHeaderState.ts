import { create } from "zustand";

type HeaderState = {
  searchText: string;
  setSearchText: (text: string) => void;
};

export const useHeaderState = create<HeaderState>((set) => ({
  searchText: "",
  setSearchText: (text: string) => {
    set({ searchText: text });
  },
}));
