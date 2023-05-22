import { Button, Message } from "@arco-design/web-react";
import { IconSync } from "@arco-design/web-react/icon";
import { useSavingState } from "../store/useSavingState";
import { pick } from "lodash";
import { useConfig, useStorage } from "../hooks";
import { useIncrementalUpdateState } from "../store/useIncrementalUpdateState";
import { batchSyncSender } from "../utils";
import { useEffect, useState } from "react";
import { useSideMenuState } from "../store/useSideMenuState";
import { useSharedContent } from "../hooks/useSharedContent";

const AUTO_SYNC_DURATION = 1000 * 60;
export const SyncButton = () => {
  const { config, httpHelper } = useConfig();
  const [selectedId, selectedType] = useSideMenuState((state) => [
    state.selectedId,
    state.selectedType,
  ]);
  const { batchSyncReceiver, setupBatchSyncSender } = useStorage();
  const { incrementalUpdateSerialNumber } = useIncrementalUpdateState((state) =>
    pick(state, ["incrementalUpdateSerialNumber"])
  );
  const { isSyncing, setIsSyncing } = useSavingState((state) =>
    pick(state, ["isSyncing", "setIsSyncing"])
  );
  const { updateSharedContent } = useSharedContent();

  const handleSync = async (showMessage: boolean = true) => {
    async function syncLocalData() {
      try {
        if (!batchSyncSender.isBatchedActionListEmpty) {
          setupBatchSyncSender();
          const syncResult = await batchSyncSender.syncBatchedAction();
          if (syncResult.downloadCount + syncResult.uploadCount === 0) {
            showMessage && Message.info("已是最新");
          } else {
            showMessage && Message.success("同步成功");
          }
          return;
        }

        const result = await httpHelper.getRemoteUpdate(
          incrementalUpdateSerialNumber
        );

        if (result && result.length) {
          showMessage && Message.success(`同步成功`);
          batchSyncReceiver.syncLocalData(result);
        } else {
          showMessage && Message.info("已是最新");
        }
      } catch (error) {
        console.error("同步失败", error);
      }
    }

    async function syncSharedContent() {
      try {
        const syncResult = await updateSharedContent(selectedId);
        if (syncResult.downloadCount + syncResult.uploadCount === 0) {
          showMessage && Message.info("已是最新");
        } else {
          showMessage && Message.success("同步成功");
        }
      } catch (error) {
        console.error("更新共享内容失败", error);
      }
    }

    setIsSyncing(true);

    try {
      if (config.backendURL) {
        await syncLocalData();
      }

      if (selectedType === "sharedContents") {
        await syncSharedContent();
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const hideSyncButton =
    !config.backendURL && selectedType !== "sharedContents";

  useEffect(() => {
    const timer = setInterval(() => {
      if (!hideSyncButton) {
        console.log("auto sync");
        handleSync(false);
      }
    }, AUTO_SYNC_DURATION);

    return () => {
      clearInterval(timer);
    };
  }, [config.backendURL, selectedType]);

  if (hideSyncButton) {
    return null;
  }

  return (
    <Button
      type="text"
      icon={<IconSync spin={isSyncing} />}
      onClick={() => handleSync()}
    />
  );
};
