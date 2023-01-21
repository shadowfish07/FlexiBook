export default class {
  constructor(private data: StorageData) {}

  selectCategory(id: string, parentId?: string): Category | undefined {
    if (!parentId) return this.data.categories.get(id) ?? undefined;
    const parent = this.data.categories.get(parentId);
    if (!parent) return undefined;
    return this.selectCategory(parent.id, parent.parentId);
  }
}
