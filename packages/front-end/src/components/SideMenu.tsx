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
import { getTimestamp } from "../utils";

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
  const { updateRecord: updateTagRecord } = useStorage({ useKey: "tags" });
  const {
    data: categories,
    updateField,
    updateRecord: updateCategoryRecord,
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

  const treeCategory = selectHelper.getTreeOf("categories");
  const treeTag = selectHelper.getTreeOf("tags");

  const handleAddCategory = () => {
    const newCategory = getNewCategoryTemplate();
    updateCategoryRecord(newCategory.id, newCategory);
  };

  const handleAddTag = () => {
    const newTag = getNewTagTemplate();
    updateTagRecord(newTag.id, newTag);
  };

  const getNewTagTemplate = (parentId?: string): Tag => {
    return {
      id: nanoid(),
      title: "",
      color: "#CB2E34",
      createdAt: getTimestamp(),
      deletedAt: undefined,
      parentId,
    };
  };

  const getNewCategoryTemplate = (parentId?: string): Category => {
    return {
      id: nanoid(),
      title: "",
      icon: "📂",
      createdAt: getTimestamp(),
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

  const getTreeNodesOf = <T extends "categories" | "tags">(
    key: T,
    treeData: TreeOf<TransformTreeOfType<T>>[]
  ) => {
    const resultNode: JSX.Element[] = [];

    const pushNode = (
      arr: JSX.Element[],
      subData: TreeOf<TransformTreeOfType<T>>
    ) => {
      if (key === "categories") {
        arr.push(
          <MenuItem
            key={subData.id}
            hoveringId={hoveringId}
            category={subData as unknown as Category}
            onMenuItemMouseEnter={handleMenuItemMouseEnter}
            onCategoryItemUpdate={handleCategoryChange}
            onAddSubCategory={handleAddSubCategory}
          />
        );
        return;
      } else if (key === "tags") {
        arr.push(
          <MenuItem
            key={subData.id}
            hoveringId={hoveringId}
            tag={subData as unknown as Tag}
            onMenuItemMouseEnter={handleMenuItemMouseEnter}
          />
        );
      }
    };

    const getSubTreeNodes = (parent: TreeOf<TransformTreeOfType<T>>) => {
      const result: JSX.Element[] = [];

      parent.children?.forEach((subData) => {
        if (!subData.children || subData.children.length === 0) {
          pushNode(result, subData);
          return;
        }
        result.push(getSubTreeNodes(subData));
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

      if (key === "categories") {
        return (
          <SubMenu
            key={parent.id}
            hoveringId={hoveringId}
            category={parent as unknown as TreeOf<Category>}
            onToggleFold={handleToggleFold}
            onMenuItemMouseEnter={handleMenuItemMouseEnter}
            onCategoryItemUpdate={handleCategoryChange}
            onAddSubCategory={handleAddSubCategory}
          >
            {result}
          </SubMenu>
        );
      } else if (key === "tags") {
        return (
          <SubMenu
            key={parent.id}
            hoveringId={hoveringId}
            tag={parent as unknown as Tag}
            onToggleFold={handleToggleFold}
            onMenuItemMouseEnter={handleMenuItemMouseEnter}
          >
            {result}
          </SubMenu>
        );
      }

      return <></>;
    };

    treeData.forEach((data) => {
      if (data.deletedAt) {
        return;
      }
      if (!data.children || data.children.length === 0) {
        pushNode(resultNode, data);
        return;
      }

      resultNode.push(getSubTreeNodes(data));
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

        {getTreeNodesOf("categories", treeCategory)}

        <StyledSectionHeader style={{ marginTop: 20 }}>
          <Typography.Text
            type="secondary"
            style={{ userSelect: "none", fontSize: 13, marginLeft: 9 }}
          >
            标签
          </Typography.Text>
          <Button
            type="text"
            size="mini"
            onClick={handleAddTag}
            icon={<IconPlus />}
          />
        </StyledSectionHeader>

        {getTreeNodesOf("tags", treeTag)}
      </Menu>
    </>
  );

  function handleAddSubCategory(parentCategory: Category | TreeOf<Category>) {
    const newCategory = getNewCategoryTemplate(parentCategory.id);
    const newChildren = categories.get(parentCategory.id)?.children || [];

    updateCategoryRecord(newCategory.id, newCategory);
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
