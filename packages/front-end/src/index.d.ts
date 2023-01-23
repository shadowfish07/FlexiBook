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
  children?: string[];
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

// convert a property of a type from a Map to an array
type MapToArray<T> = {
  [P in keyof T]: T[P] extends Map<any, infer V>
    ? V[]
    : T[P] extends Map<any, infer V> | undefined
    ? V[] | undefined
    : T[P];
};

declare type StorageData = {
  categories: Map<string, Category>;
  bookmarks: Map<string, Bookmark>;
};

declare type TreeCategory = Omit<Category, "children"> & {
  children?: TreeCategory[];
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
