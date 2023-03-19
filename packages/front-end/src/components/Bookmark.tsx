import { Card, Image, Message, Typography } from "@arco-design/web-react";
import { IconCommon, IconLoading, IconTag } from "@arco-design/web-react/icon";
import dayjs from "dayjs";
import parseUrl from "parse-url";
import { useEffect, useState } from "react";
import { AddBookmarkPopover, BookmarkDescriptionItem, CategoryInfo } from ".";
import { useStorage } from "../hooks";
import { useBookmarkLoadState } from "../store/useBookmarkLoadState";
import { loadBlob } from "../utils";
import isToday from "dayjs/plugin/isToday";
import styled from "styled-components";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { DnDTypes } from "../constants";
import { AddTagPopover } from "./AddTagPopover";
import { Tag } from "./Tag";

const StyledCard = styled(Card)<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? "none" : "block")};
  background: rgba(35, 35, 36, 0.8);
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-bg-2);
  }
`;

type Props = {
  bookmark: Bookmark;
};

export const Bookmark = ({ bookmark }: Props) => {
  const { updateField, updateHelper } = useStorage({ useKey: "bookmarks" });
  const { selectHelper } = useStorage({
    useKey: "categories",
  });
  const category = selectHelper.selectCategory(bookmark.category!);
  const [loadingBookmarks] = useBookmarkLoadState((state) => [
    state.loadingBookmarks,
  ]);
  const [icon, setIcon] = useState<string | null>(null);
  const [{ isDragging }, dragRef] = useDrag<Bookmark, BookmarkDropResult, any>(
    () => ({
      type: DnDTypes.Bookmark,
      item: bookmark,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end(item, monitor) {
        const result = monitor.getDropResult();
        switch (result?.type) {
          case "category": {
            updateField(bookmark.id, "category", result?.id);
            Message.success("成功移动书签到：" + result?.title);
            break;
          }
          case "tag": {
            if (!bookmark.tags?.includes(result.id)) {
              updateHelper.addTagsToBookmark(bookmark.id, [result.id]);
              Message.success("成功添加书签的标签：" + result.title);
            }
          }
        }
      },
    }),
    [bookmark]
  );

  useEffect(() => {
    if (bookmark.icon) {
      loadBlob(bookmark.icon).then((res) => setIcon(res));
    } else {
      setIcon(null);
    }
  }, [bookmark]);

  const getFormatDate = () => {
    dayjs.extend(isToday);
    if (dayjs(bookmark.createdAt).isToday()) {
      return dayjs(bookmark.createdAt).format("HH:mm");
    }
    if (dayjs(bookmark.createdAt).year() === dayjs().year()) {
      return dayjs(bookmark.createdAt).format("MM.DD");
    }
    return dayjs(bookmark.createdAt).format("YYYY-MM-DD");
  };

  const openPage = () => {
    chrome.tabs.create({
      url: bookmark.url,
    });
  };

  const renderTags = () => {
    if (!bookmark.tags) {
      return null;
    }
    return bookmark.tags.map((tag) => {
      return <Tag tag={selectHelper.selectTag(tag)!} />;
    });
  };

  return (
    <StyledCard
      ref={dragRef}
      hoverable
      style={{
        marginBottom: 5,
        cursor: "pointer",
        backdropFilter: "blur(5px)",
      }}
      onClick={openPage}
      hide={isDragging}
    >
      <div style={{ display: "flex" }}>
        {loadingBookmarks.has(bookmark.id) ? (
          <IconLoading style={{ width: 20, height: 20 }} />
        ) : !icon ? (
          <IconCommon style={{ width: 20, height: 20 }} />
        ) : (
          <Image width={20} height={20} src={icon} />
        )}
        <div style={{ marginLeft: 10 }}>
          <Typography.Title heading={6} style={{ margin: 0 }}>
            {bookmark.title}
          </Typography.Title>
          <BookmarkDescriptionItem>
            <CategoryInfo category={category} />
          </BookmarkDescriptionItem>
          <BookmarkDescriptionItem>
            {parseUrl(bookmark.url).resource}
          </BookmarkDescriptionItem>
          <BookmarkDescriptionItem>{getFormatDate()}</BookmarkDescriptionItem>
          <BookmarkDescriptionItem>
            {renderTags()}
            <AddTagPopover bookmarkId={bookmark.id} />
          </BookmarkDescriptionItem>
        </div>
      </div>
    </StyledCard>
  );
};
