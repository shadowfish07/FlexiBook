import { create } from "zustand";

interface IncrementalUpdateState {
  incrementalUpdateSerialNumber: number;
  setIncrementalUpdateSerialNumber: (serialNumber: number) => void;
}

export const useConfigState = create<IncrementalUpdateState>((set) => ({
  incrementalUpdateSerialNumber: 0,
  setIncrementalUpdateSerialNumber: (serialNumber: number) => {
    set({ incrementalUpdateSerialNumber: serialNumber });
  },
}));
