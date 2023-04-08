export class BatchSyncReceiver {
  constructor(
    private dataRef: React.MutableRefObject<StorageData>,
    private setStorageData: (data: StorageData) => Promise<void>,
    private setIncrementalUpdateSerialNumber: (
      serialNumber: number
    ) => Promise<void>,
    private setIsSavingLocal: (isSaving: boolean) => void
  ) {}

  syncLocalData(OperationLogs: OperationLog[]) {
    this.processSyncing(OperationLogs);
  }

  private processSyncing(operationLog: OperationLog[]) {
    this.setIncrementalUpdateSerialNumber(
      operationLog[operationLog.length - 1].id
    );

    const processCreate = (action: OperationLogAction) => {
      const { entity, entityId, data } = action;
      const entityData = this.dataRef.current[entity];
      if (entityData.has(entityId)) {
        // 信任nanoId，不会重复，不存在另一个客户端创建同ID实体的情况
        // 这里只会处理本地新增后服务端同步回来的情况
        return;
      }

      this.setIsSavingLocal(true);
      const finalData = {
        ...this.dataRef.current,
        [entity]: new Map(this.dataRef.current[entity] as any).set(
          entityId,
          data
        ),
      };

      this.setStorageData(finalData).then(() => this.setIsSavingLocal(false));
      this.dataRef.current = finalData;
    };

    const processUpdate = (action: OperationLogAction) => {
      const { entity, entityId, data } = action;

      const mergedData = {
        ...this.dataRef.current[entity].get(entityId),
        ...data,
      };

      this.setIsSavingLocal(true);
      const finalData = {
        ...this.dataRef.current,
        [entity]: new Map(this.dataRef.current[entity] as any).set(
          entityId,
          mergedData
        ),
      };

      this.setStorageData(finalData).then(() => this.setIsSavingLocal(false));
      this.dataRef.current = finalData;
    };

    for (const operationLogItem of operationLog) {
      for (const action of operationLogItem.actions) {
        switch (action.type) {
          case "create":
            processCreate(action);
            break;
          case "update":
            processUpdate(action);
            break;
          case "delete":
            processUpdate(action);
            break;
          default:
            break;
        }
      }
    }
  }
}
