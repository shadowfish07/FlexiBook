import { Menu } from "@arco-design/web-react";
import classNames from "classnames";
import { forwardRef, Fragment, useImperativeHandle } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_CATEGORY_KEY,
  DnDTypes,
} from "../constants";
import { withDrop } from "../hoc/withDrop";
import { useStorage } from "../hooks";
import { CategoryItem } from "./CategoryItem";
import { StyledMenuItem } from "./StyledMenuItem";

type IsDefault = {
  isDefault: true;
  category: Config["defaultCategory"];
  onCategoryItemUpdate?: never;
  onAddSubCategory?: never;
};

type IsNotDefault = {
  category: Category | TreeCategory;
  isDefault?: false;
  onCategoryItemUpdate: (
    id: string,
    type: "icon" | "title",
    value: string
  ) => void;
  onAddSubCategory?: (parentCategory: Category | TreeCategory) => void;
};

type Props = {
  hoveringId: string | null;
  isParent?: boolean;
  onMenuItemMouseEnter: (e: React.MouseEvent) => void;
} & (IsDefault | IsNotDefault);

type RefHandle = {
  handleDrop: () => void;
};
// TODO: 复用withDrop的方案，但由于arco design的问题，暂无法使用
// export const MenuItem = forwardRef(
//   (
//     {
//       hoveringId,
//       category,
//       isNew,
//       isParent,
//       isDefault,
//       onCategoryItemUpdate,
//       onMenuItemMouseEnter,
//       onAddSubCategory,
//     }: Props,
//     ref: React.Ref<RefHandle>
//   ) => {
//     useImperativeHandle(ref, () => ({
//       handleDrop: () => {
//         console.log("handleDrop", hoveringId);
//       },
//     }));

//     const id = isDefault ? DEFAULT_CATEGORY_ID : category.id;

//     return (
//       <Menu.Item key={id} data-id={id} onMouseEnter={onMenuItemMouseEnter}>
//         <CategoryItem
//           id={id}
//           isHovered={hoveringId === id}
//           category={category as any}
//           onUpdate={onCategoryItemUpdate as any}
//           onAddSubCategory={onAddSubCategory as any}
//           isNew={isNew}
//           isParent={isParent as any}
//           isDefault={isDefault as any}
//         />
//       </Menu.Item>
//     );
//   }
// );

// export default withDrop(MenuItem);

export default function MenuItem({
  hoveringId,
  category,
  isParent,
  isDefault,
  onCategoryItemUpdate,
  onMenuItemMouseEnter,
  onAddSubCategory,
}: Props) {
  const { updateField } = useStorage({ useKey: "bookmarks" });
  const categoryKey = isDefault
    ? DEFAULT_CATEGORY_KEY
    : `categories-${category.id}`;

  const [{ isDraggingOver }, dropRef] = useDrop(
    () => ({
      accept: DnDTypes.Bookmark,
      drop: (item: Bookmark) => {
        console.log("handleDrop", item);
        updateField(item.id, "category", categoryKey);
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
      <Menu.Item
        level={(category as TreeCategory).level ?? 1}
        key={categoryKey}
        _key={categoryKey}
        data-id={categoryKey}
        data-type="Item"
        onMouseOver={onMenuItemMouseEnter}
      >
        <CategoryItem
          isHovered={hoveringId === categoryKey}
          category={category as any}
          onUpdate={onCategoryItemUpdate as any}
          onAddSubCategory={onAddSubCategory as any}
          isParent={isParent as any}
          isDefault={isDefault as any}
          isDraggingOver={isDraggingOver}
        />
      </Menu.Item>
    </StyledMenuItem>
  );
}

MenuItem.displayName = "MenuItem";
MenuItem.menuType = "MenuItem";
