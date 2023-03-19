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

function ColorEditorPopoverContent({
  tagId,
  color: defaultColor,
}: ColorEditorPopoverContentProps) {
  const { updateField } = useStorage({ useKey: "tags" });
  const [color, setColor] = useState<string>(defaultColor);

  const handleSave = () => {
    updateField(tagId, "color", color);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <ColorPicker onSelect={(color) => setColor(color)} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" className="button" onClick={handleSave}>
          确定
        </Button>
      </div>
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
  const { updateField } = useStorage({ useKey: "tags" });

  const handleSaveTitle = (title: string) => {
    updateField(tag.id, "title", title);
  };

  return (
    <StyledTagItem color={tag.color} data-id={tag.id}>
      <CaretDown />

      <MemoizedColorWithEditorPopover tagId={tag.id} color={tag.color} />

      <InPlaceInput
        text={tag.title}
        textClassName="title"
        placeholder="输入标签名"
        onSave={handleSaveTitle}
      />
    </StyledTagItem>
  );
};
