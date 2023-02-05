import styled from "styled-components";
import ReactDOM from "react-dom";
import React, {
  forwardRef,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { EmojiPicker } from "./EmojiPicker";
import { Button, Input } from "@arco-design/web-react";
import { useConfig } from "../hooks";
import { IconCaretDown, IconPlus } from "@arco-design/web-react/icon";
import { withDrop } from "../hoc/withDrop";
import { DEFAULT_CATEGORY_ID } from "../constants";

const StyledCategoryItem = styled.div<{ isDraggingOver?: boolean }>`
  display: inline-block;

  .readonly {
    pointer-events: none;
  }

  .icon {
    user-select: none;
    margin-right: 5px;
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;

    &:hover {
      background-color: rgb(var(--primary-1));
    }
  }

  .title {
    user-select: none;
  }

  .add-sub-button .arco-icon {
    margin: 0 !important;
  }
`;

type IsDefault = {
  isDefault: true;
  category: Config["defaultCategory"];
  onUpdate?: never;
  onAddSubCategory?: never;
};

type IsNotDefault = {
  category: Category | TreeCategory;
  isDefault?: false;
  onUpdate: (id: string, type: "icon" | "title", value: string) => void;
  onAddSubCategory?: (parentCategory: Category | TreeCategory) => void;
};

type IsParent = {
  isParent: true;
  onToggleFold: () => void;
};

type IsNotParent = {
  isParent?: false;
  onToggleFold?: never;
};

type Props = {
  isHovered?: boolean;
  isDraggingOver?: boolean;
} & (IsDefault | IsNotDefault) &
  (IsParent | IsNotParent);

const DEFAULT_NEW_CATEGORY_TITLE = "新建分类";

export const CategoryItem = ({
  category,
  onUpdate,
  isDefault,
  isParent,
  isHovered,
  isDraggingOver,
  onToggleFold,
  onAddSubCategory,
}: Props) => {
  const isNew = category.title === "";

  const itemRef = useRef<null | HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(isNew);
  const [title, setTitle] = useState(category.title);
  const { config, updateConfigByKey } = useConfig();
  const [isFolding, setIsFolding] = useState(false);

  const categoryId = isDefault ? DEFAULT_CATEGORY_ID : category.id;

  const getElementPosition = () => {
    if (!itemRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }
    return {
      x: itemRef.current.getBoundingClientRect().x + 20,
      y: itemRef.current.getBoundingClientRect().y + 20,
    };
  };

  const handleHideEmojiPicker = () => {
    setShowEmojiPicker(false);
  };

  const handleClickEmoji = () => {
    setShowEmojiPicker(true);
  };

  const showTitleEditor = () => {
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    setIsEditingTitle(false);
    const finalTitle = isNew && !title ? DEFAULT_NEW_CATEGORY_TITLE : title;
    onUpdate!(categoryId, "title", finalTitle);
  };

  const handleInput = (value: string) => {
    setTitle(value);
  };

  const handleSelectEmoji = ({ native }: Emoji) => {
    handleHideEmojiPicker();
    if (isDefault) {
      updateConfigByKey("defaultCategory", {
        ...config["defaultCategory"],
        icon: native,
      });
      return;
    }
    onUpdate(categoryId, "icon", native);
  };

  const handleToggleFold = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsFolding(!isFolding);
    onToggleFold!();
  };

  return (
    <>
      <StyledCategoryItem
        ref={itemRef}
        data-id={categoryId}
        isDraggingOver={isDraggingOver}
      >
        {isParent ? (
          <IconCaretDown
            style={{
              marginRight: 0,
              transform: isFolding ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "rotate 0.3s",
            }}
            onClick={handleToggleFold}
          />
        ) : (
          <span
            style={{ width: "1em", height: "1em", display: "inline-block" }}
          />
        )}

        <span className={`icon`} onClick={handleClickEmoji}>
          {category.icon}
        </span>
        {!isEditingTitle && (
          <span
            className={`title ${isDefault ? "readonly" : ""}`}
            onDoubleClick={showTitleEditor}
          >
            {category.title}
          </span>
        )}
        {isEditingTitle && (
          <Input
            value={title}
            onChange={handleInput}
            autoFocus
            onBlur={saveTitle}
            onPressEnter={saveTitle}
            style={{ width: "calc(100% - 35px)" }}
            placeholder={isNew ? DEFAULT_NEW_CATEGORY_TITLE : "输入分类名"}
          />
        )}
        {showAddSubCategoryButton() && (
          <Button
            type="text"
            size="mini"
            onClick={handleAddSubCategory}
            className={"add-sub-button"}
            icon={<IconPlus />}
          />
        )}
      </StyledCategoryItem>
      {showEmojiPicker &&
        ReactDOM.createPortal(
          <EmojiPicker
            position={getElementPosition()}
            onHide={handleHideEmojiPicker}
            onSelect={handleSelectEmoji}
          />,
          document.getElementById("root") as HTMLElement
        )}
    </>
  );

  function handleAddSubCategory(e: Event) {
    e.stopPropagation();
    setIsFolding(true);
    onAddSubCategory && onAddSubCategory(category);
  }

  function showAddSubCategoryButton() {
    return isHovered && !isDefault;
  }
};
