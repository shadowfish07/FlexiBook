import { nanoid } from "nanoid";
import { useEffect, useContext, useRef } from "react";
import { SavingContext } from "../main";
import { useDataState } from "../store/useDataState";
import { SelectHelper } from "../utils";
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
  updateData: (newData: execType<T>) => void;
  updateRecord: (id: string, value: KeyOfMapType<execType<T>>) => void;
  createRecord: (value: Omit<KeyOfMapType<execType<T>>, "id">) => ID;
  isSaving: boolean;
  selectHelper: SelectHelper;
  updateHelper: UpdateHelper;
};

type FieldType<T> = keyof KeyOfMapType<execType<T>>;

/**
 *  若传入useKey，则返回的数据、更新数据时的入参均为StorageData[useKey]
 */
export const useStorage = <
  T extends keyof StorageData | StorageData = StorageData
>({ useKey }: Props<T> = {}): UseStorageReturnType<T> => {
  const [data, setData] = useDataState((state) => [state.data, state.setData]);
  const { isSaving, setIsSaving } = useContext(SavingContext);
  const dataRef = useRef<StorageData>(data);
  const { config } = useConfig();

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  /**
   * 直接替换整个map或local data
   */
  const updateData = (newData: execType<T>) => {
    setIsSaving(true);

    const finalData = (
      useKey
        ? { ...dataRef.current, [useKey as keyof StorageData]: newData }
        : newData
    ) as StorageData;

    setData(finalData).then(() => setIsSaving(false));
    dataRef.current = finalData;
  };

  /**
   * 更新指定id的数据
   *
   * 只能在传入useKey时使用
   */
  const updateRecord = (id: string, value: KeyOfMapType<execType<T>>) => {
    if (!useKey) {
      throw new Error("this method is only supported when useKey is passed");
    }
    setIsSaving(true);
    const finalData = {
      ...dataRef.current,
      [useKey as keyof StorageData]: new Map(
        dataRef.current[useKey as keyof StorageData] as any
      ).set(id, value),
    };

    setData(finalData).then(() => setIsSaving(false));
    dataRef.current = finalData;
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

  const createRecord = (value: Omit<KeyOfMapType<execType<T>>, "id">) => {
    const id = nanoid();
    updateRecord(id, { ...value, id } as KeyOfMapType<execType<T>>);
    return id;
  };

  const finalData = (
    useKey ? data[useKey as keyof StorageData] : data
  ) as execType<T>;

  return {
    data: finalData,
    updateField,
    updateData,
    updateRecord,
    createRecord,
    isSaving,
    selectHelper: new SelectHelper(data, config),
    updateHelper: new UpdateHelper(data, config, useKey, updateField),
  };
};
