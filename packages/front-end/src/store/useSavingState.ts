import { create } from "zustand";

type SavingState = {
  isSavingLocal: boolean;
  setIsSavingLocal: (isSaving: boolean) => void;
};

export const useSavingState = create<SavingState>((set) => ({
  isSavingLocal: false,
  setIsSavingLocal: (isSaving: boolean) => {
    set({ isSavingLocal: isSaving });
  },
}));
