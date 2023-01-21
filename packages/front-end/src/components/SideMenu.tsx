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

  const handleAddCategory = () => {
    setNewCategory(getNewCategoryTemplate());
  };

  const getNewCategoryTemplate = (): Category => {
    return {
      id: nanoid(),
      title: "",
      icon: "📂",
      deletedAt: undefined,
      children: [],
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
    const getSubCategoryTreeNodes = (parent: Category) => {
      const result: JSX.Element[] = [];

      parent.children.forEach((subCategory) => {
        if (subCategory.children.length === 0) {
          result.push(
            <Menu.Item key={subCategory.id}>
              <CategoryItem
                id={subCategory.id}
                category={subCategory}
                onUpdate={handleCategoryChange}
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
          title={
            <CategoryItem
              id={parent.id}
              category={parent}
              onUpdate={handleCategoryChange}
              isParent
              onToggleFold={handleToggleFold}
            />
          }
          selectable
        >
          {result}
        </Menu.SubMenu>
      );
    };

    [...categories.entries()].forEach(([id, category]) => {
      if (category.deletedAt) {
        return;
      }
      if (category.children.length === 0) {
        resultNode.push(
          <Menu.Item key={`categories-${id}`}>
            <CategoryItem
              id={id}
              category={category}
              onUpdate={handleCategoryChange}
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

        <Menu.Item key={`categories-default`}>
          <CategoryItem
            id={"categories-default"}
            category={config.defaultCategory}
            isDefault
          />
        </Menu.Item>

        {getCategoryTreeNodes()}

        {newCategory && (
          <Menu.Item key={`categories-${newCategory.id}`}>
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
};
