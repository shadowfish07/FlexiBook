import { DEFAULT_CATEGORY_ID } from "../constants";

export default class {
  constructor(private data: StorageData, private config: Config | undefined) {}

  selectCategory(id: string): Category | undefined {
    if (id === DEFAULT_CATEGORY_ID)
      if (this.config)
        return { id: DEFAULT_CATEGORY_ID, ...this.config.defaultCategory };
    return this.data.categories.get(id) ?? undefined;
  }

  getTreeCategory(): TreeCategory[] {
    const convertChildCategory = (
      id: string,
      level: number
    ): TreeCategory | undefined => {
      const category = this.data.categories.get(id);

      if (!category) return undefined;

      return {
        ...category,
        level,
        children: category.children
          ?.map((id) => convertChildCategory(id, level + 1))
          .filter(Boolean) as TreeCategory[],
      };
    };

    return [...this.data.categories.values()]
      .filter((item) => !item.parentId)
      .map((item) => {
        return {
          ...item,
          level: 1,
          children: item.children
            ?.map((id) => convertChildCategory(id, 2))
            .filter(Boolean) as TreeCategory[],
        };
      });
  }
}
