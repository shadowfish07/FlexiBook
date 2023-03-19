import { Menu } from "@arco-design/web-react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { DnDTypes } from "../constants";
import { useStorage } from "../hooks";
import { CategoryItem } from "./CategoryItem";
import { StyledMenuItem } from "./StyledMenuItem";
import { TagItem } from "./TagItem";

type isTag = {
  tag: Tag;
  category?: never;
  onCategoryItemUpdate?: never;
  onAddSubCategory?: never;
};

type isCategory = {
  tag?: never;
  category: Category | TreeOf<Category>;
  onCategoryItemUpdate: (
    id: string,
    type: "icon" | "title",
    value: string
  ) => void;
  onAddSubCategory?: (parentCategory: Category | TreeOf<Category>) => void;
};

type Props = {
  hoveringId: string | null;
  children: JSX.Element | JSX.Element[];
  onToggleFold: () => void;
  onMenuItemMouseEnter: (e: React.MouseEvent) => void;
} & (isTag | isCategory);

export const SubMenu = ({
  children,
  category,
  tag,
  hoveringId,
  onToggleFold,
  onMenuItemMouseEnter,
  onAddSubCategory,
  onCategoryItemUpdate,
}: Props) => {
  const { updateField } = useStorage({ useKey: "bookmarks" });
  const [{ isDraggingOver }, dropRef] = useDrop<
    Bookmark,
    BookmarkDropResult,
    any
  >(
    () => ({
      accept: DnDTypes.Bookmark,
      drop: (item, monitor) => {
        if (monitor.didDrop()) return undefined;

        if (category) {
          console.log("handleDrop category", category.id, "in", category);
          return { type: "category", ...(category as Category) };
        } else if (tag) {
          console.log("handleDrop tag", item, "in", tag);
          return { type: "tag", ...(tag as Tag) };
        }
      },
      collect: (monitor) => ({
        isDraggingOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [updateField]
  );

  const id = category ? category.id : tag.id;
  const key = category ? `categories-${id}` : `tags-${id}`;

  return (
    <StyledMenuItem
      className={classNames({ "is-dragging": isDraggingOver })}
      ref={dropRef}
      key={key}
      data-id={id}
      onMouseOver={onMenuItemMouseEnter}
    >
      {category && (
        <Menu.SubMenu
          level={(category as TreeOf<Category>).level ?? 1}
          _key={key}
          key={key}
          data-id={id}
          data-type="SubMenu"
          title={
            <CategoryItem
              category={category}
              onAddSubCategory={onAddSubCategory}
              onUpdate={onCategoryItemUpdate}
              isParent
              onToggleFold={onToggleFold}
              isHovered={hoveringId === id}
            />
          }
          selectable
        >
          {children}
        </Menu.SubMenu>
      )}

      {tag && (
        // 目前还不支持 Tag 的子菜单，后续支持后这里需要加isParent
        <Menu.SubMenu
          level={(tag as TreeOf<Tag>).level ?? 1}
          _key={key}
          key={key}
          data-id={id}
          data-type="SubMenu"
          title={<TagItem tag={tag} />}
          selectable
        >
          {children}
        </Menu.SubMenu>
      )}
    </StyledMenuItem>
  );
};

SubMenu.displayName = "SubMenu";
SubMenu.menuType = "SubMenu";
