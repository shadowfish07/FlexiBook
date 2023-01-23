import { Button, Menu, Typography } from "@arco-design/web-react";
import { useState } from "react";
import { useConfig, useStorage } from "../hooks";
import { CategoryItem } from "./CategoryItem";
import { IconPlus } from "@arco-design/web-react/icon";
import { nanoid } from "nanoid";
import styled, { createGlobalStyle } from "styled-components";
import { useSideMenuState } from "../store/useSideMenuState";

const GlobalMenuStyle = createGlobalStyle`
  /* .arco-menu-light .arco-menu-inline-header.arco-menu-selected {
    background-color: var(--color-fill-2);
  } */

  .no-margin .arco-icon {
    margin: 0 !important;
  }

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
  const [newCategory, setNewCategory] = useState<null | Category>(null);
  const { config } = useConfig();
  const setSelect = useSideMenuState((state) => state.setSelect);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    "categories-default",
  ]);
  const [hoveringId, setHoveringId] = useState<string | null>(null);

  const treeCategory = selectHelper.getTreeCategory();

  console.log("treeCategory", treeCategory);

  const handleAddCategory = () => {
    setNewCategory(getNewCategoryTemplate());
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
      updateRecord(id, {
        ...(newCategory as Category),
        [type]: value,
      });
      setNewCategory(null);
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
            <Menu.Item
              key={subCategory.id}
              data-id={subCategory.id}
              onMouseEnter={handleMenuItemMouseEnter}
            >
              <CategoryItem
                id={subCategory.id}
                isHovered={hoveringId === subCategory.id}
                category={subCategory}
                onUpdate={handleCategoryChange}
                onAddSubCategory={handleAddSubCategory}
                isNew={subCategory.title === ""}
              />
            </Menu.Item>
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
        <Menu.SubMenu
          key={`categories-${parent.id}`}
          data-id={parent.id}
          title={
            <span data-id={parent.id} onMouseEnter={handleMenuItemMouseEnter}>
              <CategoryItem
                id={parent.id}
                category={parent}
                onAddSubCategory={handleAddSubCategory}
                onUpdate={handleCategoryChange}
                isParent
                onToggleFold={handleToggleFold}
                isHovered={hoveringId === parent.id}
              />
            </span>
          }
          selectable
        >
          {result}
        </Menu.SubMenu>
      );
    };

    treeCategory.forEach((category) => {
      if (category.deletedAt) {
        return;
      }
      if (!category.children || category.children.length === 0) {
        resultNode.push(
          <Menu.Item
            key={`categories-${category.id}`}
            data-id={category.id}
            onMouseEnter={handleMenuItemMouseEnter}
          >
            <CategoryItem
              id={category.id}
              isHovered={hoveringId === category.id}
              category={category}
              onUpdate={handleCategoryChange}
              onAddSubCategory={handleAddSubCategory}
            />
          </Menu.Item>
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

        <Menu.Item
          key={`categories-default`}
          data-id={"categories-default"}
          onMouseEnter={handleMenuItemMouseEnter}
        >
          <CategoryItem
            id={"categories-default"}
            category={config.defaultCategory}
            isDefault
          />
        </Menu.Item>

        {getCategoryTreeNodes()}

        {newCategory && (
          <Menu.Item
            key={`categories-${newCategory.id}`}
            data-id={newCategory.id}
            onMouseEnter={handleMenuItemMouseEnter}
          >
            <CategoryItem
              id={newCategory.id}
              category={newCategory}
              isNew
              onUpdate={handleCategoryChange}
            />
          </Menu.Item>
        )}
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
    const id = e.currentTarget.getAttribute("data-id");
    setHoveringId(id);
  }
};
