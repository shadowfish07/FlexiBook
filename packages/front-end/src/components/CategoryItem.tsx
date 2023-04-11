import styled from "styled-components";
import ReactDOM from "react-dom";
import { useRef, useState } from "react";
import { EmojiPicker } from "./EmojiPicker";
import { Button } from "@arco-design/web-react";
import { useConfig } from "../hooks";
import { IconPlus } from "@arco-design/web-react/icon";
import { DEFAULT_CATEGORY_ID } from "../constants";
import { CaretDown } from "./CaretDown";
import { InPlaceInput } from "./InPlaceInput";

const StyledCategoryItem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  width: 100%;

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
  category: Category | TreeOf<Category>;
  isDefault?: false;
  onUpdate: (id: string, type: "icon" | "title", value: string) => void;
  onAddSubCategory?: (parentCategory: Category | TreeOf<Category>) => void;
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
} & (IsDefault | IsNotDefault) &
  (IsParent | IsNotParent);

const DEFAULT_NEW_CATEGORY_TITLE = "新建分类";

export const CategoryItem = ({
  category,
  onUpdate,
  isDefault,
  isParent,
  isHovered,
  onToggleFold,
  onAddSubCategory,
}: Props) => {
  const isNew = category.title === "";

  const itemRef = useRef<null | HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  const handleSaveTitle = (value: string) => {
    const finalTitle = isNew && !value ? DEFAULT_NEW_CATEGORY_TITLE : value;
    onUpdate!(categoryId, "title", finalTitle);
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

  const handleToggleFold = () => {
    onToggleFold!();
  };

  return (
    <>
      <StyledCategoryItem ref={itemRef} data-id={categoryId}>
        <div className="left">
          <CaretDown
            isFolding={isFolding}
            isParent={isParent}
            onToggleFold={handleToggleFold}
          />

          <span className={`icon`} onClick={handleClickEmoji}>
            {category.icon}
          </span>

          <InPlaceInput
            text={category.title}
            placeholder={isNew ? DEFAULT_NEW_CATEGORY_TITLE : "输入分类名"}
            isReadOnly={isDefault}
            defaultStatus={isNew}
            onSave={handleSaveTitle}
            textClassName="title"
          />
        </div>

        <div className="right">
          {showAddSubCategoryButton() && (
            <Button
              type="text"
              size="mini"
              onClick={handleAddSubCategory}
              className={"add-sub-button"}
              icon={<IconPlus />}
            />
          )}
        </div>
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
