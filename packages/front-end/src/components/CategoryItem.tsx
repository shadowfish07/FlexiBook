import styled from "styled-components";
import ReactDOM from "react-dom";
import { SyntheticEvent, useRef, useState } from "react";
import { EmojiPicker } from "./EmojiPicker";
import { Input } from "@arco-design/web-react";
import { useConfig } from "../hooks";
import { IconCaretDown } from "@arco-design/web-react/icon";

const StyledCategoryItem = styled.div`
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
`;

type IsDefault = {
  isDefault: true;
  onUpdate?: never;
};

type IsNotDefault = {
  isDefault?: false;
  onUpdate: (id: string, type: "icon" | "title", value: string) => void;
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
  id: string;
  category: Config["defaultCategory"];
  isNew?: boolean;
} & (IsDefault | IsNotDefault) &
  (IsParent | IsNotParent);

const DEFAULT_NEW_CATEGORY_TITLE = "新建分类";

export const CategoryItem = ({
  id,
  category,
  isNew = false,
  onUpdate,
  isDefault,
  isParent,
  onToggleFold,
}: Props) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(isNew);
  const [title, setTitle] = useState(category.title);
  const { config, updateConfigByKey } = useConfig();
  const [isFolding, setIsFolding] = useState(false);

  const getElementPosition = () => {
    if (!ref.current) {
      return {
        x: 0,
        y: 0,
      };
    }
    return {
      x: ref.current.getBoundingClientRect().x + 20,
      y: ref.current.getBoundingClientRect().y + 20,
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
    onUpdate!(id, "title", finalTitle);
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
    onUpdate(id, "icon", native);
  };

  const handleToggleFold = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsFolding(!isFolding);
    onToggleFold!();
  };

  return (
    <>
      <StyledCategoryItem ref={ref}>
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
};
