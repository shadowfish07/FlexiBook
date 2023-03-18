declare type Emoji = {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
};

declare type ID = string;

declare type Tag = {
  id: ID;
  title: string;
  color: string;
  deletedAt?: number;
  parentId?: ID;
  children?: ID[]; // 暂不支持嵌套
};

declare type Category = {
  id: ID;
  parentId?: ID;
  title: string;
  icon: string;
  deletedAt?: number;
  children?: ID[];
};

declare type Bookmark = {
  id: ID;
  title: string;
  url: string;
  tags?: ID[];
  deletedAt?: number;
  createdAt: number;
  category?: ID;
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
  tags: Map<string, Tag>;
  categories: Map<string, Category>;
  bookmarks: Map<string, Bookmark>;
};

declare type TreeOf<T extends Category | Tag> = Omit<T, "children"> & {
  children?: TreeOf<T>[];
  level: number;
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

declare type TransformTreeOfType<T extends "categories" | "tags"> =
  T extends "categories" ? Category : Tag;

declare type BookmarkDropResult =
  | undefined
  | ({ id: string } & (
      | ({ type: "category" } & Category)
      | ({ type: "tag" } & Tag)
    ));
