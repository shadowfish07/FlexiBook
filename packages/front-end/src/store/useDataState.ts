import create from "zustand";

type DataState = {
  data: StorageData;
  setData: (data: StorageData) => Promise<void>;
  loadLocalData: () => Promise<StorageData>;
};

const initLocalData = async () => {
  const initData: StorageData = {
    categories: new Map<string, Category>(),
    bookmarks: new Map<string, Bookmark>(),
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
  };

  Object.keys(finalData).forEach((key) => {
    finalData[key as keyof JsonStorageData] = [
      ...data[key as keyof StorageData].values(),
    ] as any;
  });

  // finalData.categories = [
  //   {
  //     children: [
  //       {
  //         children: [],
  //         icon: "📂",
  //         id: "6V8x2C6bhp9tQwAjhlb3O",
  //         title: "新建分类2232323",
  //         parentId: "6V8x2C6bhp9tQwAjhlb34",
  //       },
  //       {
  //         children: [],
  //         icon: "📂",
  //         id: "6V8x2C6bhp9tQwAjhlb31",
  //         title: "4523dsfd",
  //         parentId: "6V8x2C6bhp9tQwAjhlb34",
  //       },
  //       {
  //         children: [
  //           {
  //             children: [],
  //             icon: "📂",
  //             id: "6V8x2C6bhp9tQwAjhlb32",
  //             title: "dasdasdasda",
  //             parentId: "6V8x2C6bhp9tQwAjhlb33",
  //           },
  //         ],
  //         icon: "📂",
  //         id: "6V8x2C6bhp9tQwAjhlb33",
  //         title: "adadasdsd",
  //         parentId: "6V8x2C6bhp9tQwAjhlb34",
  //       },
  //     ],
  //     icon: "📂",
  //     id: "6V8x2C6bhp9tQwAjhlb34",
  //     title: "新建分类",
  //   },
  // ];

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
