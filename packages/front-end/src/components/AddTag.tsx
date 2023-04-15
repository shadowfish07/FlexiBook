import {
  Button,
  Divider,
  Input,
  Space,
  TreeSelect,
  Tag as AcroTag,
} from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { useState } from "react";
import styled from "styled-components";
import { useStorage } from "../hooks";
import { ColorPicker } from "./ColorPicker";
import { TagInfo } from "./TagInfo";

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
  const { updateField } = useStorage({ useKey: "bookmarks" });
  const [names, setNames] = useState(
    selectHelper.selectBookmark(bookmarkId)?.tags || []
  );

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
    return <TagInfo key={id} tag={tag!}></TagInfo>;
  };

  const renderTag = (props: any) => {
    const {
      value: { value: id },
      onClose,
    } = props;

    const tag = selectHelper.selectTag(id);

    const handleClose = () => {
      setNames(names.filter((name) => name !== id));
      onClose();
    };

    return (
      <AcroTag closable onClose={handleClose} style={{ margin: 5 }}>
        <TagInfo key={id} tag={tag!}></TagInfo>
      </AcroTag>
    );
  };

  return (
    <StyledContent>
      <Space direction="vertical" style={{ width: "100%" }}>
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
