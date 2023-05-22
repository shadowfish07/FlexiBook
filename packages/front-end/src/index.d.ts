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
  createdAt: number;
  deletedAt?: number;
  parentId?: ID;
  children?: ID[]; // 暂不支持嵌套
};

declare type Category = {
  id: ID;
  parentId?: ID;
  title: string;
  icon: string;
  createdAt: number;
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
  category?: ID; // 为空、为DEFAULT_CATEGORY_ID 时，表示默认分类
  icon?: string;
  isFavorite?: boolean;
};

declare type SupportTypeOfStorageData = KeyOfMapType<
  StorageData[keyof StorageData]
>;

declare type KeyOfMapType<T> = T extends Map<infer K, infer V> ? V : never;

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
  clientId: string;
  clientSecret: string;
  enableSync: boolean;
  backendURL?: string;
};

declare type TransformTreeOfType<T extends "categories" | "tags"> =
  T extends "categories" ? Category : Tag;

declare type BookmarkDropResult =
  | undefined
  | ({ id: string } & (
      | ({ type: "category" } & Category)
      | ({ type: "tag" } & Tag)
    ));

declare type OperationLog = {
  id: number; // 序列ID
  uniqueId: string;
  clientId: string;
  createdAt: number;
  actions: OperationLogAction[];
};

declare type EntitySupportedByBackend = "tags" | "categories" | "bookmarks";

declare type OperationLogAction = {
  type: "create" | "update" | "delete";
  entity: EntitySupportedByBackend;
  entityId: ID;
  data: Record<string, unknown>;
};

declare type ServerOauth = {
  nickname: string;
  oauthItems: Oauth[];
  invitations: Invitation[];
  invitationUsageHistories: InvitationUsageHistory[];
};

declare type Oauth = {
  clientId: string;
  secret: string;
  nickname?: string;
  deletedAt?: number;
  createdAt: number;
  permissions: Permission[];
};

declare type Invitation = {
  id: string;
  password?: string;
  deletedAt?: number;
  createdAt: number;
  usesLimit?: number;
  usesUntil?: number;
  defaultPermissions: Permission[];
};

declare type Permission = {
  entity: "categories" | "tags";
  entityId: string;
  allowEdit: boolean;
  invitationId: string;
};

declare type InvitationUsageHistory = {
  clientId: string;
  createdAt: number;
  invitationId: string;
};

/**
 * 来自其他用户共享的数据
 */
declare type SharedContent = {
  /**
   * 如果导入了来自同一个用户的多个分享，secret相同，url会被替换成最后一次的分享链接
   * 因此url基本无用，被分享方并不知道一个url对应什么分享内容，只知道分享方总共对自己分享了哪些内容
   */
  url: string;
  secret: string;
  nickname: string;
  createdAt: number;
  incrementalUpdateSerialNumber: number;
  data: StorageData;
};

// API --------------------------------------------

declare type ActivateInvitationRequest = {
  password?: string;
  nickname?: string;
  permissions: Permission[];
};

declare type APIResult<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "error";
      message: string;
    };

declare type WebsiteMetaResult = {
  title: string;
  description: string;
};
