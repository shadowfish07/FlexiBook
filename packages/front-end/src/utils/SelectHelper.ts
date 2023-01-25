export default class {
  constructor(private data: StorageData) {}

  selectCategory(id: string, parentId?: string): Category | undefined {
    if (!parentId) return this.data.categories.get(id) ?? undefined;
    const parent = this.data.categories.get(parentId);
    if (!parent) return undefined;
    return this.selectCategory(parent.id, parent.parentId);
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
