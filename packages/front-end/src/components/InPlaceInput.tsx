import { Input } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledInPlaceInput = styled.div`
  display: inline-block;

  .readonly {
    pointer-events: none;
  }
`;

type Props = {
  text?: string;
  isReadOnly?: boolean;
  defaultStatus?: boolean;
  placeholder?: string;
  textClassName?: string;
  onSave?: (text: string) => void;
};

export const InPlaceInput = ({
  text,
  defaultStatus,
  placeholder,
  isReadOnly,
  textClassName,
  onSave,
}: Props) => {
  const [_text, setText] = useState(text || "");
  const [isEditingTitle, setIsEditingTitle] = useState(defaultStatus || false);
  const showTitleEditor = () => {
    setIsEditingTitle(true);
  };

  const handleInput = (value: string) => {
    setText(value);
  };

  const handleSave = () => {
    setIsEditingTitle(false);
    onSave && onSave(_text);
  };

  return (
    <StyledInPlaceInput>
      {!isEditingTitle && (
        <span
          className={`${textClassName} ${isReadOnly ? "readonly" : ""}`}
          onDoubleClick={showTitleEditor}
        >
          {text}
        </span>
      )}
      {isEditingTitle && (
        <Input
          value={_text}
          onChange={handleInput}
          autoFocus
          onBlur={handleSave}
          onPressEnter={handleSave}
          style={{ width: "calc(100% - 35px)" }}
          placeholder={placeholder}
        />
      )}
    </StyledInPlaceInput>
  );
};
