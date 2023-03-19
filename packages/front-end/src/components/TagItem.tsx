import { Button, Popover, Space } from "@arco-design/web-react";
import { nanoid } from "nanoid";
import { memo, useState } from "react";
import styled from "styled-components";
import { useStorage } from "../hooks";
import { CaretDown } from "./CaretDown";
import { ColorPicker } from "./ColorPicker";
import { InPlaceInput } from "./InPlaceInput";

type Props = {
  tag: Tag;
};

const StyledTagItem = styled.div<{ color: string }>`
  display: inline-block;

  .title {
    user-select: none;
    vertical-align: middle;
  }

  .color {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    display: inline-block;
    vertical-align: middle;
    margin-left: 6px;
    margin-right: 12px;
  }
`;

type ColorWithEditorPopoverProps = {
  tagId: ID;
  color: string;
};
type ColorEditorPopoverContentProps = {
  tagId: ID;
  color: string;
};

const DEFAULT_NEW_TAG_TITLE = "新建标签";

function ColorEditorPopoverContent({
  tagId,
  color: defaultColor,
}: ColorEditorPopoverContentProps) {
  const { updateField } = useStorage({ useKey: "tags" });

  const handleSave = (color: string) => {
    updateField(tagId, "color", color);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <ColorPicker onSelect={handleSave} defaultColor={defaultColor} />
    </Space>
  );
}

function ColorWithEditorPopover({ tagId, color }: ColorWithEditorPopoverProps) {
  const [showColorEditor, setShowColorEditor] = useState(false);

  return (
    <Popover
      position="bl"
      popupVisible={showColorEditor}
      onVisibleChange={(visible) => setShowColorEditor(visible)}
      trigger="click"
      style={{ width: 268 }}
      content={<ColorEditorPopoverContent tagId={tagId} color={color} />}
    >
      <span className="color" />
    </Popover>
  );
}

// 应该是因为acro的menu问题，在hover时会疯狂重渲染
const MemoizedColorWithEditorPopover = memo(ColorWithEditorPopover);

export const TagItem = ({ tag }: Props) => {
  const isNew = tag.title === "";
  const { updateField } = useStorage({ useKey: "tags" });

  const handleSaveTitle = (title: string) => {
    const finalTitle = isNew && !title ? DEFAULT_NEW_TAG_TITLE : title;
    updateField(tag.id, "title", finalTitle);
  };

  return (
    <StyledTagItem color={tag.color} data-id={tag.id}>
      <CaretDown />

      <MemoizedColorWithEditorPopover tagId={tag.id} color={tag.color} />

      <InPlaceInput
        text={tag.title}
        textClassName="title"
        placeholder={isNew ? DEFAULT_NEW_TAG_TITLE : "输入标签名"}
        defaultStatus={isNew}
        onSave={handleSaveTitle}
      />
    </StyledTagItem>
  );
};
