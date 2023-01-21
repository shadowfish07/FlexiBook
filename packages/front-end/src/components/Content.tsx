import { Empty } from "@arco-design/web-react";
import Content from "@arco-design/web-react/es/Layout/content";
import { memo, useContext } from "react";
import { useStorage } from "../hooks";
import { useSideMenuState } from "../store/useSideMenuState";
import { Bookmark } from "./Bookmark";

export default memo(() => {
  const { data: bookmarks } = useStorage({ useKey: "bookmarks" });
  const [selectedId, selectedType] = useSideMenuState((state) => [
    state.selectedId,
    state.selectedType,
  ]);

  const filteredBookmarks = [...bookmarks.values()].filter((bookmark) => {
    if (selectedType === "categories") {
      if (selectedId === "default") return true;
      return bookmark.category === selectedId;
    }
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
});
