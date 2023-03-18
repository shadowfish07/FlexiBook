import {
  Button,
  Divider,
  Input,
  Space,
  TreeSelect,
  Tag as AcroTag,
} from "@arco-design/web-react";
import { IconCheck, IconPlus } from "@arco-design/web-react/icon";
import { useState } from "react";
import styled from "styled-components";
import { useStorage } from "../hooks";
import { useDataState } from "../store/useDataState";
import { Tag } from "./Tag";

type Props = {
  bookmarkId: ID;
  onSave?: (id: string) => void;
};

const StyledContent = styled.div`
  .footer {
    display: flex;
    justify-content: flex-end;
  }
`;

const StyledColorItem = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    box-shadow: 0 0 0 2px #eaf4ff;
  }
`;

const StyledColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;
`;

type ColorPickerProps = {
  onSelect?: (color: string) => void;
  defaultColor?: string;
};

type ColorItemProps = {
  color: string;
  isSelected: boolean;
  onClick: (color: string) => void;
};

function ColorPicker({ defaultColor, onSelect }: ColorPickerProps) {
  const colors = [
    "#CB2E34",
    "#CC5729",
    "#D26913",
    "#CC961F",
    "#CFB325",
    "#84B723",
    "#129A37",
    "#1FA6AA",
    "#2971CF",
    "#1D4DD2",
    "#5A25B0",
    "#B01BB6",
    "#CB2B88",
  ];

  const [selectedColor, setSelectedColor] = useState<string>(
    defaultColor ?? colors[0]
  );

  const ColorItem = ({ color, isSelected, onClick }: ColorItemProps) => {
    return (
      <StyledColorItem color={color} onClick={() => onClick(color)}>
        {isSelected && <IconCheck style={{ color: "#ffffff" }} />}
      </StyledColorItem>
    );
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    onSelect && onSelect(color);
  };

  return (
    <StyledColorPicker>
      <Space wrap size={6}>
        {colors.map((color) => (
          <ColorItem
            color={color}
            onClick={handleColorClick}
            isSelected={selectedColor === color}
          />
        ))}
      </Space>
    </StyledColorPicker>
  );
}

function CreateNewTag() {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#CB2E34");
  const { createRecord } = useStorage({ useKey: "tags" });

  const handleSave = () => {
    createRecord({
      title: name,
      color,
    });
    setName("");
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleSelectColor = (color: string) => {
    setColor(color);
  };

  return (
    <div style={{ padding: "10px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input value={name} onChange={handleNameChange} placeholder="标签名" />
        <Button type="text" icon={<IconPlus />} onClick={handleSave}>
          新增
        </Button>
      </div>
      <ColorPicker onSelect={handleSelectColor} />
    </div>
  );
}

export function AddTag({ bookmarkId, onSave }: Props) {
  const [isButtonEnable, setIsButtonEnable] = useState(false);
  const { data: tags, selectHelper } = useStorage({ useKey: "tags" });
  const [names, setNames] = useState(selectHelper.getIdsOfTags());
  const { updateField } = useStorage({ useKey: "bookmarks" });

  const handleNameChange = (names: []) => {
    setNames(names);
    if (names.length > 0) {
      setIsButtonEnable(true);
    } else {
      setIsButtonEnable(false);
    }
  };

  const handleSave = () => {
    updateField(bookmarkId, "tags", names);
    onSave && onSave(bookmarkId);
  };

  const treeData = [...tags.values()].map((tag) => {
    return {
      title: tag.title,
      key: tag.id,
    };
  });

  const renderTitle = (props: any) => {
    const { _key: id } = props;
    const tag = selectHelper.selectTag(id);
    return <Tag key={id} tag={tag!}></Tag>;
  };

  const renderTag = (props: any) => {
    const {
      value: { value: id },
      onClose,
    } = props;

    const tag = selectHelper.selectTag(id);
    return (
      <AcroTag closable onClose={onClose} style={{ margin: 5 }}>
        <Tag key={id} tag={tag!}></Tag>
      </AcroTag>
    );
  };

  return (
    <StyledContent>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* <Input value={name} onChange={handleNameChange} placeholder="标签名" /> */}
        <TreeSelect
          placeholder="输入或选择标签"
          value={names}
          renderTag={renderTag}
          onChange={handleNameChange}
          treeData={treeData}
          showSearch
          multiple
          treeProps={{
            renderTitle,
          }}
          dropdownMenuStyle={{
            maxHeight: 250,
            display: "flex",
            flexDirection: "column",
            width: 275,
          }}
          dropdownRender={(menu) => {
            return (
              <>
                <div style={{ flex: 1, overflow: "auto" }}>{menu}</div>
                <div>
                  <Divider style={{ margin: "5px 0" }} />
                  <CreateNewTag />
                </div>
              </>
            );
          }}
        />
        <div className="footer">
          <Button
            disabled={!isButtonEnable}
            type="primary"
            className="button"
            onClick={handleSave}
          >
            确定
          </Button>
        </div>
      </Space>
    </StyledContent>
  );
}
