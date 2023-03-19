import { UseStorageReturnType } from "../hooks";

export default class<T extends keyof StorageData | StorageData = StorageData> {
  constructor(
    private data: StorageData,
    private config: Config | undefined,
    private useKey: StorageData | keyof StorageData | undefined,
    private updateField: UseStorageReturnType<T>["updateField"]
  ) {}

  addTagsToBookmark(bookmarkId: ID, tags: (Tag | ID)[]) {
    if (this.useKey !== "bookmarks")
      throw new Error("useKey must be bookmarks");
    const bookmark = this.data.bookmarks.get(bookmarkId);
    if (!bookmark) return;
    const newTags = [
      ...(bookmark.tags || []),
      ...tags.map((item) => {
        if (typeof item === "string") return item;
        return item.id;
      }),
    ];
    (this.updateField as UseStorageReturnType<"bookmarks">["updateField"])(
      bookmarkId,
      "tags",
      newTags
    );
  }

  removeTagsFromBookmark(bookmarkId: ID, tags: (Tag | ID)[]) {
    if (this.useKey !== "bookmarks")
      throw new Error("useKey must be bookmarks");
    const bookmark = this.data.bookmarks.get(bookmarkId);
    if (!bookmark) return;
    const newTags = (bookmark.tags || []).filter((item: Tag | ID) => {
      if (typeof item === "string") return !tags.includes(item);
      return !tags.includes(item.id);
    });
    (this.updateField as UseStorageReturnType<"bookmarks">["updateField"])(
      bookmarkId,
      "tags",
      newTags
    );
  }
}
