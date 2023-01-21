declare type Emoji = {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
};

declare type Category = {
  id: string;
  parentId?: string;
  title: string;
  icon: string;
  deletedAt?: number;
  children: Category[];
};

declare type Bookmark = {
  id: string;
  title: string;
  url: string;
  deletedAt?: number;
  createdAt: number;
  category?: string;
  parentCategory?: string;
  icon?: string;
  isFavorite?: boolean;
};

declare type SupportTypeOfStorageData = KeyOfMapType<
  StorageData[keyof StorageData]
>;

declare type KeyOfMapType<T> = T extends Map<infer K, infer V> ? V : never;

declare type StorageData = {
  categories: Map<string, Category>;
  bookmarks: Map<string, Bookmark>;
};

declare type JsonStorageData = {
  [K in keyof StorageData]: KeyOfMapType<StorageData[K]>[];
};

declare type Config = {
  defaultCategory: {
    title: string;
    icon: string;
  };
  favorite: {
    title: string;
    icon: string;
  };
  backendURL?: string;
};

declare type BlobKeys = "iconBlob";
