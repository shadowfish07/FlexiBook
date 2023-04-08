import { nanoid } from "nanoid";
import HttpHelper from "./HttpHelper";
import { getTimestamp } from "./utils";
import { BatchSyncReceiver } from "./BatchSyncReceiver";

class BatchSyncSender {
  private httpHelper: HttpHelper | undefined;
  private incrementalUpdateSerialNumber = 0;
  private batchedActionList: OperationLogAction[] = [];
  private bathSyncReceiver: BatchSyncReceiver | undefined;
  private clientId: string | undefined;
  private timer: number | undefined;

  setClientId(clientId: string) {
    this.clientId = clientId;
  }

  setHttpHelper(httpHelper: HttpHelper) {
    this.httpHelper = httpHelper;
  }

  setIncrementalUpdateSerialNumber(newValue: number) {
    if (
      this.batchedActionList.length > 0 &&
      newValue !== this.incrementalUpdateSerialNumber
    ) {
      throw new Error(
        "batchedActionList is not empty,can not set incrementalUpdateSerialNumber"
      );
    }

    this.incrementalUpdateSerialNumber = newValue;
  }

  setBathSyncReceiver(bathSyncReceiver: BatchSyncReceiver) {
    this.bathSyncReceiver = bathSyncReceiver;
  }

  addBatchedAction(action: OperationLogAction) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.timer = window.setTimeout(() => {
      this.syncBatchedAction();
    }, 5000);

    this.batchedActionList.push(action);
  }

  syncBatchedAction() {
    this.timer = undefined;

    if (!this.httpHelper) {
      throw new Error("httpHelper is not set");
    }
    if (this.incrementalUpdateSerialNumber === 0) {
      throw new Error("incrementalUpdateSerialNumber is not set");
    }
    if (!this.bathSyncReceiver) {
      throw new Error("bathSyncReceiver is not set");
    }
    if (!this.clientId) {
      throw new Error("clientId is not set");
    }

    if (this.batchedActionList.length === 0) {
      return;
    }

    const operationLog: OperationLog = {
      id: this.incrementalUpdateSerialNumber,
      uniqueId: nanoid(),
      clientId: this.clientId,
      createdAt: getTimestamp(),
      actions: this.batchedActionList,
    };

    this.httpHelper.syncLocalUpdate(operationLog).then((operationLogList) => {
      if (operationLogList) {
        this.bathSyncReceiver?.syncLocalData(operationLogList);
      }
    });

    this.batchedActionList = [];
  }
}

export default new BatchSyncSender();
