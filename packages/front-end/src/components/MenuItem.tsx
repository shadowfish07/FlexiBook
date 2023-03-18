import { Menu } from "@arco-design/web-react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { DEFAULT_CATEGORY_KEY, DnDTypes } from "../constants";

import { useStorage } from "../hooks";
import { CategoryItem } from "./CategoryItem";
import { StyledMenuItem } from "./StyledMenuItem";

type IsDefault = {
  isDefault: true;
  tag?: never;
  category: Config["defaultCategory"];
  onCategoryItemUpdate?: never;
  onAddSubCategory?: never;
};

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

type IsNotDefault = {
  isDefault?: false;
} & (isTag | isCategory);

type Props = {
  hoveringId: string | null;
  isParent?: boolean;
  onMenuItemMouseEnter: (e: React.MouseEvent) => void;
} & (IsDefault | IsNotDefault);

export default function MenuItem({
  hoveringId,
  tag,
  category,
  isParent,
  isDefault,
  onCategoryItemUpdate,
  onMenuItemMouseEnter,
  onAddSubCategory,
}: Props) {
  const { updateField } = useStorage({ useKey: "bookmarks" });
  const id = category
    ? isDefault
      ? DEFAULT_CATEGORY_KEY
      : category?.id
    : tag.id;
  const key = category
    ? isDefault
      ? DEFAULT_CATEGORY_KEY
      : `categories-${id}`
    : `tags-${id}`;

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
          console.log("handleDrop category", item, "in", category);
          return { type: "category", ...(category as Category) };
        }
      },
      collect: (monitor) => ({
        isDraggingOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [updateField]
  );

  return (
    <StyledMenuItem
      className={classNames({ "is-dragging": isDraggingOver })}
      ref={dropRef}
    >
      {category && (
        <Menu.Item
          level={(category as TreeOf<Category>).level ?? 1}
          key={key}
          _key={key}
          data-id={key}
          data-type="Item"
          onMouseOver={onMenuItemMouseEnter}
        >
          <CategoryItem
            isHovered={hoveringId === key}
            category={category as any}
            onUpdate={onCategoryItemUpdate as any}
            onAddSubCategory={onAddSubCategory as any}
            isParent={isParent as any}
            isDefault={isDefault as any}
            isDraggingOver={isDraggingOver}
          />
        </Menu.Item>
      )}
    </StyledMenuItem>
  );
}

MenuItem.displayName = "MenuItem";
MenuItem.menuType = "MenuItem";
