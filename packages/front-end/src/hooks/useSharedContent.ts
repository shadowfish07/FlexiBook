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
  selectHelpers: Record<SharedContentURL, SelectHelper>;
  updateSharedContent: (url: string) => Promise<{
    uploadCount: number;
    downloadCount: number;
  }>;
};

export const useSharedContent = (): UseSharedContentReturnType => {
  const { sharedContents, writeLocalData, getSharedContent } =
    useSharedContentState();
  const { isSavingLocal, setIsSavingLocal } = useSavingState((state) =>
    pick(state, ["isSavingLocal", "setIsSavingLocal"])
  );
  const { config, httpHelper } = useConfig();

  const addSharedContent = (
    newSharedContent: Omit<SharedContent, "createdAt">
  ) => {
    writeLocalData([
      ...sharedContents,
      { ...newSharedContent, createdAt: getTimestamp() },
    ]);
  };

  const updateSharedContent = async (
    url: string
  ): Promise<{
    uploadCount: number;
    downloadCount: number;
  }> => {
    const sharedContent = getSharedContent(url);
    if (!sharedContent) {
      throw new Error("sharedContent not found");
    }

    const content = await httpHelper.getSharedContentRemoteUpdate(
      new URL(url).origin,
      sharedContent!.incrementalUpdateSerialNumber,
      sharedContent!.secret
    );

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
      { current: sharedContent.data },
      setStorageData,
      setIncrementalUpdateSerialNumber,
      setIsSavingLocal
    );

    batchSyncReceiver.syncLocalData(content);

    return {
      uploadCount: 0,
      downloadCount: content.length,
    };
  };

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
    selectHelpers,
    sharedContentMap,
    updateSharedContent,
  };
};
