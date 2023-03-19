import { DEFAULT_CATEGORY_ID } from "../constants";

export default class {
  constructor(private data: StorageData, private config: Config | undefined) {}

  getIdsOfAllTags(): string[] {
    return [...this.data.tags.keys()];
  }

  selectTag(id: string): Tag | undefined {
    return this.data.tags.get(id) ?? undefined;
  }

  selectBookmark(id: string): Bookmark | undefined {
    return this.data.bookmarks.get(id) ?? undefined;
  }

  selectCategory(id: string): Category | undefined {
    if (id === DEFAULT_CATEGORY_ID)
      if (this.config)
        return { id: DEFAULT_CATEGORY_ID, ...this.config.defaultCategory };
    return this.data.categories.get(id) ?? undefined;
  }

  getTreeOf<T extends "categories" | "tags">(
    key: T
  ): TreeOf<TransformTreeOfType<T>>[] {
    const convertChildCategory = (
      id: string,
      level: number
    ): TreeOf<TransformTreeOfType<T>> | undefined => {
      const data = this.data[key].get(id);

      if (!data) return undefined;

      return {
        ...data,
        level,
        children: data.children
          ?.map((id) => convertChildCategory(id, level + 1))
          .filter(Boolean),
      } as unknown as TreeOf<TransformTreeOfType<T>>;
    };

    return [...this.data[key].values()]
      .filter((item) => !item.parentId)
      .map((item) => {
        return {
          ...item,
          level: 1,
          children: item.children
            ?.map((id) => convertChildCategory(id, 2))
            .filter(Boolean),
        };
      }) as unknown as TreeOf<TransformTreeOfType<T>>[];
  }
}
