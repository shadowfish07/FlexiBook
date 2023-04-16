import { useEffect, useRef } from "react";
import { useSharedContentState } from "../store/useSharedContentState";
import { SelectHelper, getTimestamp } from "../utils";
import { useSavingState } from "../store/useSavingState";
import { pick } from "lodash";
import { BatchSyncReceiver } from "../utils/BatchSyncReceiver";
import { useConfig } from "./useConfig";

type SharedContentURL = string;

export type UseSharedContentReturnType = {
  sharedContents: SharedContent[];
  sharedContentMap: Record<SharedContentURL, SharedContent>;
  addSharedContent: (
    newSharedContent: Omit<SharedContent, "createdAt">
  ) => void;
  batchSyncReceiver: BatchSyncReceiver;
  selectHelpers: Record<SharedContentURL, SelectHelper>;
};

export const useSharedContent = (url?: string): UseSharedContentReturnType => {
  const { sharedContents, writeLocalData, getSharedContent } =
    useSharedContentState();
  const dataRef = useRef<StorageData>(getSharedContent(url || "")?.data!);
  const { isSavingLocal, setIsSavingLocal } = useSavingState((state) =>
    pick(state, ["isSavingLocal", "setIsSavingLocal"])
  );
  const { config } = useConfig();

  useEffect(() => {
    dataRef.current = getSharedContent(url || "")?.data!;
  }, [sharedContents]);

  const addSharedContent = (
    newSharedContent: Omit<SharedContent, "createdAt">
  ) => {
    writeLocalData([
      ...sharedContents,
      { ...newSharedContent, createdAt: getTimestamp() },
    ]);
  };

  const setStorageData = async (data: StorageData) => {
    if (!url) {
      throw new Error("url is required when using useSharedContent");
    }
    const index = sharedContents.findIndex((item) => item.url === url);
    sharedContents[index] = {
      ...sharedContents[index],
      data,
    };
    setIsSavingLocal(true);
    try {
      await writeLocalData(sharedContents);
    } catch (error) {
    } finally {
      setIsSavingLocal(false);
    }
  };

  const setIncrementalUpdateSerialNumber = async (serialNumber: number) => {
    if (!url) {
      throw new Error("url is required when using useSharedContent");
    }
    const index = sharedContents.findIndex((item) => item.url === url);
    sharedContents[index] = {
      ...sharedContents[index],
      incrementalUpdateSerialNumber: serialNumber,
    };
    setIsSavingLocal(true);
    try {
      await writeLocalData(sharedContents);
    } catch (error) {
    } finally {
      setIsSavingLocal(false);
    }
  };

  const batchSyncReceiver = new BatchSyncReceiver(
    dataRef,
    setStorageData,
    setIncrementalUpdateSerialNumber,
    setIsSavingLocal
  );

  const selectHelpers = sharedContents.reduce((prev, curr) => {
    return {
      ...prev,
      [curr.url]: new SelectHelper(curr.data, config),
    };
  }, {});

  const sharedContentMap = sharedContents.reduce((prev, curr) => {
    return {
      ...prev,
      [curr.url]: curr,
    };
  }, {});

  return {
    sharedContents,
    addSharedContent,
    batchSyncReceiver,
    selectHelpers,
    sharedContentMap,
  };
};
