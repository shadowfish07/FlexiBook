import { create } from "zustand";

type SavingState = {
  isSavingLocal: boolean;
  setIsSavingLocal: (isSaving: boolean) => void;
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
};

export const useSavingState = create<SavingState>((set) => ({
  isSavingLocal: false,
  setIsSavingLocal: (isSaving: boolean) => {
    set({ isSavingLocal: isSaving });
  },
  isSyncing: false,
  setIsSyncing: (isSyncing: boolean) => {
    set({ isSyncing: isSyncing });
  },
}));
