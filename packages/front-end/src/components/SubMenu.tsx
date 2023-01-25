import { Menu } from "@arco-design/web-react";
import classNames from "classnames";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { DnDTypes } from "../constants";
import { withDrop } from "../hoc/withDrop";
import { useStorage } from "../hooks";
import { CategoryItem } from "./CategoryItem";
import { StyledMenuItem } from "./StyledMenuItem";

type Props = {
  hoveringId: string | null;
  category: Category | TreeCategory;
  children: JSX.Element | JSX.Element[];
  onToggleFold: () => void;
  onMenuItemMouseEnter: (e: React.MouseEvent) => void;
  onCategoryItemUpdate: (
    id: string,
    type: "icon" | "title",
    value: string
  ) => void;
  onAddSubCategory?: (parentCategory: Category | TreeCategory) => void;
};

type RefHandle = {
  handleDrop: () => void;
};

// TODO: 复用withDrop的方案，但由于arco design的问题，暂无法使用
// export const SubMenu = forwardRef(
//   (
//     {
//       children,
//       category,
//       hoveringId,
//       onToggleFold,
//       onMenuItemMouseEnter,
//       onAddSubCategory,
//       onCategoryItemUpdate,
//     }: Props,
//     ref: React.Ref<RefHandle>
//   ) => {
//     useImperativeHandle(ref, () => ({
//       handleDrop: () => {
//         console.log("handleDrop", category.id);
//       },
//     }));

//     return (
//       <Menu.SubMenu
//         key={`categories-${category.id}`}
//         data-id={category.id}
//         title={
//           <span data-id={category.id} onMouseEnter={onMenuItemMouseEnter}>
//             <CategoryItem
//               id={category.id}
//               category={category}
//               onAddSubCategory={onAddSubCategory}
//               onUpdate={onCategoryItemUpdate}
//               isParent
//               onToggleFold={onToggleFold}
//               isHovered={hoveringId === category.id}
//             />
//           </span>
//         }
//         selectable
//       >
//         <Menu.Item key="aaa">123</Menu.Item>

//         {children}
//       </Menu.SubMenu>
//     );
//   }
// );

// export default withDrop(SubMenu);

export const SubMenu = ({
  children,
  category,
  hoveringId,
  onToggleFold,
  onMenuItemMouseEnter,
  onAddSubCategory,
  onCategoryItemUpdate,
}: Props) => {
  const { updateField } = useStorage({ useKey: "bookmarks" });
  const [{ isDraggingOver }, dropRef] = useDrop(
    () => ({
      accept: DnDTypes.Bookmark,
      drop: (item: Bookmark) => {
        console.log("handleDrop", category.id);
        updateField(item.id, "category", category.id);
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
      key={`categories-${category.id}`}
      data-id={category.id}
      onMouseOver={onMenuItemMouseEnter}
    >
      <Menu.SubMenu
        level={(category as TreeCategory).level ?? 1}
        _key={`categories-${category.id}`}
        key={`categories-${category.id}`}
        data-id={category.id}
        data-type="SubMenu"
        title={
          <CategoryItem
            category={category}
            onAddSubCategory={onAddSubCategory}
            onUpdate={onCategoryItemUpdate}
            isParent
            onToggleFold={onToggleFold}
            isHovered={hoveringId === category.id}
          />
        }
        selectable
      >
        {children}
      </Menu.SubMenu>
    </StyledMenuItem>
  );
};

SubMenu.displayName = "SubMenu";
SubMenu.menuType = "SubMenu";
