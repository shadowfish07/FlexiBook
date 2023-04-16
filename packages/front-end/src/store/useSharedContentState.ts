import { clone, cloneDeep } from "lodash";
import { create } from "zustand";

type SharedContentState = {
  sharedContents: SharedContent[];
  loadLocalData: () => Promise<void>;
  writeLocalData: (sharedContent: SharedContent[]) => Promise<void>;
  getSharedContent: (url: string) => SharedContent | undefined;
};

export const useSharedContentState = create<SharedContentState>((set, get) => ({
  sharedContents: [],
  loadLocalData: async () => {
    const data = await chrome.storage.local.get(["sharedContent"]);
    if (!data || !data.sharedContent) return;

    const finalData = data.sharedContent.map((sharedContent: SharedContent) => {
      if (!sharedContent.data) return sharedContent;
      const dataMap = {} as StorageData;
      Object.keys(sharedContent.data).forEach((key) => {
        dataMap[key as keyof StorageData] = new Map();
        sharedContent.data![key as keyof StorageData].forEach(
          (item: { id: string; [key: string]: unknown }) => {
            dataMap[key as keyof StorageData].set(item.id, item as any);
          }
        );
      });

      return {
        ...sharedContent,
        data: dataMap,
      };
    });

    set({ sharedContents: finalData });
  },
  writeLocalData: async (sharedContent) => {
    set({ sharedContents: sharedContent });
    const finalData = sharedContent.map((item) => {
      const data: JsonStorageData = {
        categories: [] as any,
        bookmarks: [] as any,
        tags: [] as any,
      };

      data.bookmarks = [...(item.data?.bookmarks.values() || [])];
      data.categories = [...(item.data?.categories.values() || [])];
      data.tags = [...(item.data?.tags.values() || [])];
      return {
        ...item,
        data,
      };
    });
    await chrome.storage.local.set({
      sharedContent: finalData,
    });
  },
  getSharedContent: (url: string): SharedContent | undefined => {
    return get().sharedContents.find((item) => item.url === url);
  },
}));
