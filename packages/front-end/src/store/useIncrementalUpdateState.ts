import { create } from "zustand";
import { HttpHelper } from "../utils";

const IS_HAS_NOT_EVER_SYNCED = 0;

interface IncrementalUpdateState {
  incrementalUpdateSerialNumber: number;
  setIncrementalUpdateSerialNumber: (serialNumber: number) => Promise<void>;
  loadFromLocal: () => Promise<number>;
  isHasNotEverSynced: () => boolean;
}

const loadFromLocal = async () => {
  const serialNumber = (
    await chrome.storage.local.get(["incrementalUpdateSerialNumber"])
  ).incrementalUpdateSerialNumber;
  console.log("loadFromLocal", serialNumber);
  return serialNumber || IS_HAS_NOT_EVER_SYNCED;
};

const writeToLocal = async (serialNumber: number) => {
  console.log("writeToLocal", serialNumber);
  await chrome.storage.local.set({
    incrementalUpdateSerialNumber: serialNumber,
  });
};

export const useIncrementalUpdateState = create<IncrementalUpdateState>(
  (set, get) => ({
    incrementalUpdateSerialNumber: IS_HAS_NOT_EVER_SYNCED,
    setIncrementalUpdateSerialNumber: async (serialNumber: number) => {
      set({ incrementalUpdateSerialNumber: serialNumber });
      await writeToLocal(serialNumber);
    },
    loadFromLocal: async () => {
      const serialNumber = await loadFromLocal();
      set({ incrementalUpdateSerialNumber: serialNumber });
      return serialNumber;
    },
    isHasNotEverSynced: () => {
      return get().incrementalUpdateSerialNumber === IS_HAS_NOT_EVER_SYNCED;
    },
  })
);
