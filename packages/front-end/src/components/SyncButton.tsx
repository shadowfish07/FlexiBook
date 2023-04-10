import { Button, Message } from "@arco-design/web-react";
import { IconSync } from "@arco-design/web-react/icon";
import { useSavingState } from "../store/useSavingState";
import { pick } from "lodash";
import { useConfig, useStorage } from "../hooks";
import { useIncrementalUpdateState } from "../store/useIncrementalUpdateState";
import { batchSyncSender } from "../utils";
import { useEffect, useState } from "react";

const AUTO_SYNC_DURATION = 1000 * 60;
export const SyncButton = () => {
  const { config, httpHelper } = useConfig();
  const { batchSyncReceiver, setupBatchSyncSender } = useStorage();
  const { incrementalUpdateSerialNumber } = useIncrementalUpdateState((state) =>
    pick(state, ["incrementalUpdateSerialNumber"])
  );
  const { isSyncing, setIsSyncing } = useSavingState((state) =>
    pick(state, ["isSyncing", "setIsSyncing"])
  );
  const handleSync = async (showMessage: boolean = true) => {
    setIsSyncing(true);

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
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleSync(false);
    }, AUTO_SYNC_DURATION);
  }, []);

  if (!config.backendURL) {
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
