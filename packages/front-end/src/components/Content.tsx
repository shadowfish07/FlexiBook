import { Empty } from "@arco-design/web-react";
import Content from "@arco-design/web-react/es/Layout/content";
import { useStorage } from "../hooks";
import { useSideMenuState } from "../store/useSideMenuState";
import { Bookmark } from "./Bookmark";
import { pick } from "lodash";
import { useHeaderState } from "../store/useHeaderState";
import { useSharedContent } from "../hooks/useSharedContent";

export default () => {
  const { data: bookmarks } = useStorage({ useKey: "bookmarks" });
  const { sharedContentMap } = useSharedContent();
  const [selectedId, selectedType] = useSideMenuState((state) => [
    state.selectedId,
    state.selectedType,
  ]);
  console.log(
    "🚀 ~ file: Content.tsx:17 ~ selectedId, selectedType:",
    selectedId,
    selectedType
  );
  const { searchText } = useHeaderState((state) => pick(state, ["searchText"]));

  const combineBookmarks = (): Map<string, Bookmark> => {
    if (selectedId === "default" && selectedType === "categories") {
      return bookmarks;
    }
    const result = new Map<string, Bookmark>(bookmarks);
    for (const sharedContent of Object.values(sharedContentMap)) {
      for (const bookmark of sharedContent.data.bookmarks.values()) {
        result.set(bookmark.id, bookmark);
      }
    }

    return result;
  };

  const usingBookmarks =
    selectedType === "sharedContents"
      ? sharedContentMap[selectedId].data.bookmarks
      : combineBookmarks();

  const filteredBookmarks = [...usingBookmarks.values()]
    .filter((bookmark) => {
      if (selectedType === "categories") {
        if (selectedId === "default") return true;
        return bookmark.category === selectedId;
      } else if (selectedType === "tags") {
        return bookmark.tags?.includes(selectedId);
      } else if (selectedType === "sharedContents") {
        return true;
      }
    })
    .filter((bookmark) => {
      if (!searchText) return true;
      return bookmark.title.toLowerCase().includes(searchText.toLowerCase());
    });

  return (
    <Content style={{ padding: 10 }}>
      {filteredBookmarks.length === 0 ? (
        <Empty description="还没有书签，现在开始慢慢积累吧~" />
      ) : (
        filteredBookmarks
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((bookmark) => <Bookmark key={bookmark.id} bookmark={bookmark} />)
      )}
    </Content>
  );
};
