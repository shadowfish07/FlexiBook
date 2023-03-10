import { Button, Menu, Typography } from "@arco-design/web-react";
import { useState } from "react";
import { useConfig, useStorage } from "../hooks";
import { CategoryItem } from "./CategoryItem";
import { IconPlus } from "@arco-design/web-react/icon";
import { nanoid } from "nanoid";
import styled, { createGlobalStyle } from "styled-components";
import { useSideMenuState } from "../store/useSideMenuState";
import MenuItem from "./MenuItem";
import { SubMenu } from "./SubMenu";
import { DEFAULT_CATEGORY_KEY } from "../constants";

const GlobalMenuStyle = createGlobalStyle`
  /* .arco-menu-light .arco-menu-inline-header.arco-menu-selected {
    background-color: var(--color-fill-2);
  } */

  .arco-menu-inline-header {
    text-overflow: unset !important;
  }

  .menu-hide-submenu-button .arco-menu-icon-suffix {
    display: none;
  }
`;

const StyledSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -4px;
  margin-bottom: 5px;
`;

export const SideMenu = () => {
  const {
    data: categories,
    updateField,
    updateRecord,
    selectHelper,
  } = useStorage({
    useKey: "categories",
  });
  const { config } = useConfig();
  const setSelect = useSideMenuState((state) => state.setSelect);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    DEFAULT_CATEGORY_KEY,
  ]);
  const [hoveringId, setHoveringId] = useState<string | null>(null);

  const treeCategory = selectHelper.getTreeCategory();

  const handleAddCategory = () => {
    const newCategory = getNewCategoryTemplate();
    updateRecord(newCategory.id, newCategory);
  };

  const getNewCategoryTemplate = (parentId?: string): Category => {
    return {
      id: nanoid(),
      title: "",
      icon: "📂",
      deletedAt: undefined,
      parentId,
    };
  };

  const handleCategoryChange = (
    id: string,
    type: "icon" | "title",
    value: string
  ) => {
    if (!categories.has(id)) {
      console.warn("category not found", id);
      return;
    }

    updateField(id, type, value);
  };

  const handleClickMenuItem = (key: string) => {
    setSelect(key);
    setSelectedKeys([key]);
  };

  const getCategoryTreeNodes = () => {
    const resultNode: JSX.Element[] = [];
    const getSubCategoryTreeNodes = (parent: TreeCategory) => {
      const result: JSX.Element[] = [];

      parent.children?.forEach((subCategory) => {
        if (!subCategory.children || subCategory.children.length === 0) {
          result.push(
            // TODO: 复用withDrop的方案
            <MenuItem
              key={subCategory.id}
              hoveringId={hoveringId}
              category={subCategory}
              onMenuItemMouseEnter={handleMenuItemMouseEnter}
              onCategoryItemUpdate={handleCategoryChange}
              onAddSubCategory={handleAddSubCategory}
            />
          );
          return;
        }
        result.push(getSubCategoryTreeNodes(subCategory));
      });

      const handleToggleFold = () => {
        if (openKeys.includes(`categories-${parent.id}`)) {
          setOpenKeys(
            openKeys.filter((key) => key !== `categories-${parent.id}`)
          );
        } else {
          setOpenKeys([...openKeys, `categories-${parent.id}`]);
        }
      };

      return (
        <SubMenu
          key={parent.id}
          hoveringId={hoveringId}
          category={parent}
          onToggleFold={handleToggleFold}
          onMenuItemMouseEnter={handleMenuItemMouseEnter}
          onCategoryItemUpdate={handleCategoryChange}
          onAddSubCategory={handleAddSubCategory}
        >
          {result}
        </SubMenu>
      );
    };

    treeCategory.forEach((category) => {
      if (category.deletedAt) {
        return;
      }
      if (!category.children || category.children.length === 0) {
        resultNode.push(
          // TODO: 复用withDrop的方案，但由于arco design的问题，暂无法使用
          <MenuItem
            key={category.id}
            hoveringId={hoveringId}
            category={category}
            onMenuItemMouseEnter={handleMenuItemMouseEnter}
            onCategoryItemUpdate={handleCategoryChange}
            onAddSubCategory={handleAddSubCategory}
          />
        );
        return;
      }

      resultNode.push(getSubCategoryTreeNodes(category));
    });

    return resultNode;
  };

  return (
    <>
      <GlobalMenuStyle />
      <Menu
        mode="vertical"
        style={{ paddingTop: 10 }}
        onClickMenuItem={handleClickMenuItem}
        selectable
        className={"menu-hide-submenu-button"}
        ellipsis={false}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onMouseLeave={handleMenuMouseLeave}
      >
        <StyledSectionHeader>
          <Typography.Text
            type="secondary"
            style={{ userSelect: "none", fontSize: 13, marginLeft: 9 }}
          >
            分类
          </Typography.Text>
          <Button
            type="text"
            size="mini"
            onClick={handleAddCategory}
            icon={<IconPlus />}
          />
        </StyledSectionHeader>

        <MenuItem
          key={DEFAULT_CATEGORY_KEY}
          hoveringId={hoveringId}
          isDefault
          category={config.defaultCategory}
          onMenuItemMouseEnter={handleMenuItemMouseEnter}
        />

        {getCategoryTreeNodes()}
      </Menu>
    </>
  );

  function handleAddSubCategory(parentCategory: Category | TreeCategory) {
    const newCategory = getNewCategoryTemplate(parentCategory.id);
    const newChildren = categories.get(parentCategory.id)?.children || [];

    updateRecord(newCategory.id, newCategory);
    updateField(
      parentCategory.id,
      "children",
      newChildren.concat(newCategory.id)
    );
    if (!openKeys.includes(`categories-${parentCategory.id}`)) {
      setOpenKeys([...openKeys, `categories-${parentCategory.id}`]);
    }
  }

  function handleMenuMouseLeave() {
    setHoveringId(null);
  }

  function handleMenuItemMouseEnter(e: React.MouseEvent) {
    e.stopPropagation();
    const id = e.currentTarget.getAttribute("data-id");
    setHoveringId(id);
  }
};
