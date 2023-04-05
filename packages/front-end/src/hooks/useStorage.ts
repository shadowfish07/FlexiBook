import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useEffect, useContext, useRef } from "react";
import { SavingContext } from "../main";
import { useDataState } from "../store/useDataState";
import { getTimestamp, SelectHelper } from "../utils";
import UpdateHelper from "../utils/UpdateHelper";
import { useConfig } from "./useConfig";

type Props<T extends keyof StorageData | StorageData = StorageData> = {
  useKey?: T;
};

type execType<T> = T extends keyof StorageData ? StorageData[T] : T;

type ID = string;

export type UseStorageReturnType<
  T extends keyof StorageData | StorageData = StorageData
> = {
  data: execType<T>;
  updateField: <P extends FieldType<T>>(
    id: string,
    field: P,
    value: KeyOfMapType<execType<T>>[P]
  ) => void;
  updateRecord: (id: string, value: KeyOfMapType<execType<T>>) => void;
  createRecord: (value: CreateRecordValue<T>) => ID;
  isSaving: boolean;
  selectHelper: SelectHelper;
  updateHelper: UpdateHelper;
};

type FieldType<T> = keyof KeyOfMapType<execType<T>>;

type CreateRecordValue<T> = Omit<
  Omit<KeyOfMapType<execType<T>>, "id">,
  "createdAt"
>;

/**
 *  若传入useKey，则返回的数据、更新数据时的入参均为StorageData[useKey]
 */
export const useStorage = <T extends keyof StorageData>({
  useKey,
}: Props<T> = {}): UseStorageReturnType<T> => {
  const [data, setData] = useDataState((state) => [state.data, state.setData]);
  const { isSaving, setIsSaving } = useContext(SavingContext);
  const dataRef = useRef<StorageData>(data);
  const { config } = useConfig();

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  /**
   * 更新指定id的数据
   *
   * 只能在传入useKey时使用
   */
  const updateRecord = (id: string, value: KeyOfMapType<execType<T>>) => {
    if (!useKey) {
      throw new Error("this method is only supported when useKey is passed");
    }

    console.log("updateRecord", id, value);

    const operationLog = getOperationLog();

    console.log("operationLog", operationLog);

    setIsSaving(true);
    const finalData = {
      ...dataRef.current,
      [useKey as keyof StorageData]: new Map(
        dataRef.current[useKey as keyof StorageData] as any
      ).set(id, value),
    };

    setData(finalData).then(() => setIsSaving(false));
    dataRef.current = finalData;

    function getOperationLog(): OperationLog {
      const operationLogActionData: Record<string, unknown> = {};

      const oldData = dataRef.current[useKey as keyof StorageData].get(id) as
        | KeyOfMapType<execType<T>>
        | undefined;
      if (!oldData) {
        return {
          id: nanoid(),
          clientId: "",
          createdAt: getTimestamp(),
          actions: [
            {
              type: "create",
              entity: useKey!,
              entityId: id,
              data: value,
            },
          ],
        };
      }

      const unvisitedNewDataKeys = new Set<keyof KeyOfMapType<execType<T>>>(
        Object.keys(value) as any
      );

      for (const oldKey in oldData) {
        unvisitedNewDataKeys.delete(oldKey);

        if (oldData[oldKey] !== value[oldKey]) {
          operationLogActionData[oldKey] = value[oldKey];
        }

        for (const newKey of unvisitedNewDataKeys) {
          operationLogActionData[newKey as string] = value[newKey];
        }
      }

      return {
        id: nanoid(),
        clientId: "",
        createdAt: getTimestamp(),
        actions: [
          {
            type: "update",
            entity: useKey!,
            entityId: id,
            data: operationLogActionData,
          },
        ],
      };
    }
  };

  /**
   * 更新指定id的指定字段数据
   *
   * 只能在传入useKey时使用
   */
  const updateField = <P extends FieldType<T>>(
    id: string,
    field: P,
    value: KeyOfMapType<execType<T>>[P]
  ) => {
    if (!useKey) {
      throw new Error("this method is only supported when useKey is passed");
    }

    const operationLog: OperationLog = {
      id: nanoid(),
      clientId: "",
      createdAt: getTimestamp(),
      actions: [
        {
          type: isAddingRecord(useKey, id) ? "create" : "update",
          entity: useKey,
          entityId: id,
          data: {
            [field]: value,
          },
        },
      ],
    };

    setIsSaving(true);
    const finalData = {
      ...dataRef.current,
      [useKey as keyof StorageData]: new Map(
        dataRef.current[useKey as keyof StorageData] as any
      ).set(id, {
        ...dataRef.current[useKey as keyof StorageData].get(id),
        [field]: value,
      }),
    };
    setData(finalData).then(() => setIsSaving(false));
    dataRef.current = finalData;
  };

  const createRecord = (value: CreateRecordValue<T>) => {
    const id = nanoid();
    const createAt = getTimestamp();
    updateRecord(id, { ...value, id, createAt } as KeyOfMapType<execType<T>>);
    return id;
  };

  const finalData = (
    useKey ? data[useKey as keyof StorageData] : data
  ) as execType<T>;

  return {
    data: finalData,
    updateField,
    updateRecord,
    createRecord,
    isSaving,
    selectHelper: new SelectHelper(data, config),
    updateHelper: new UpdateHelper(data, config, useKey, updateField),
  };

  function isAddingRecord(entity: keyof StorageData, entityId: ID): boolean {
    return !dataRef.current[entity].has(entityId);
  }
};
