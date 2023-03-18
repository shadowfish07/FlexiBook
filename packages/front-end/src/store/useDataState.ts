import create from "zustand";

type DataState = {
  data: StorageData;
  setData: (data: StorageData) => Promise<void>;
  loadLocalData: () => Promise<StorageData>;
};

const patchJsonDataForOldVersion = (jsonData: JsonStorageData) => {
  if (!jsonData.tags) {
    jsonData.tags = [];
  }
};

const initLocalData = async () => {
  const initData: StorageData = {
    categories: new Map<string, Category>(),
    bookmarks: new Map<string, Bookmark>(),
    tags: new Map<string, Tag>(),
  };

  await writeLocalData(initData);
  return initData;
};

const loadLocalData = async () => {
  let jsonData = (await chrome.storage.local.get(["data"])).data;
  console.log("loaded data", jsonData);
  if (!jsonData || Object.keys(jsonData).length === 0) {
    console.log("init data");
    jsonData = await initLocalData();
  }

  patchJsonDataForOldVersion(jsonData);

  const dataMap = {} as StorageData;

  Object.keys(jsonData).forEach((key) => {
    dataMap[key as keyof StorageData] = new Map();
    jsonData[key as keyof StorageData].forEach(
      (item: { id: string; [key: string]: unknown }) => {
        dataMap[key as keyof StorageData].set(item.id, item as any);
      }
    );
  });

  console.log("parsed data", dataMap);

  return dataMap;
};

const writeLocalData = async (data: StorageData) => {
  const finalData: JsonStorageData = {
    categories: [] as any,
    bookmarks: [] as any,
    tags: [] as any,
  };

  finalData.bookmarks = [...data.bookmarks.values()];
  finalData.categories = [...data.categories.values()];
  finalData.tags = [...data.tags.values()];

  console.log("writeData", finalData);
  await chrome.storage.local.set({ data: finalData });
  return;
};

export const useDataState = create<DataState>((set) => ({
  data: {} as StorageData,
  setData: async (data: StorageData) => {
    set({ data });
    await writeLocalData(data);
  },
  loadLocalData: async () => {
    const dataMap = await loadLocalData();
    set({ data: dataMap });
    return dataMap;
  },
}));
