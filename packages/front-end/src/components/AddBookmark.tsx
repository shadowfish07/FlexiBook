import {
  Message,
  Space,
  Typography,
  Input,
  Alert,
  Button,
  TreeSelect,
  TreeSelectProps,
} from "@arco-design/web-react";
import { nanoid } from "nanoid";
import parseUrl from "parse-url";
import { useState } from "react";
import styled from "styled-components";
import { DEFAULT_CATEGORY_ID } from "../constants";
import { useConfig, useStorage } from "../hooks";
import { useBookmarkLoadState } from "../store/useBookmarkLoadState";
import { getTimestamp, saveBlob } from "../utils";

const StyledContent = styled.div`
  .footer {
    display: flex;
    justify-content: flex-end;
  }
`;

type Props = {
  fromExtension?: boolean;
  onSave?: (id: string) => void;
};

export const AddBookmark = ({ fromExtension, onSave }: Props) => {
  const { config, httpHelper } = useConfig();
  const [url, setUrl] = useState("");
  const [isButtonEnable, setIsButtonEnable] = useState(false);
  const { updateRecord, updateField, selectHelper } = useStorage({
    useKey: "bookmarks",
  });
  const [addLoadingBookmarks, removeLoadingBookmarks] = useBookmarkLoadState(
    (state) => [state.addLoadingBookmarks, state.removeLoadingBookmarks]
  );
  const [selectedCategory, setSelectedCategory] = useState<{
    label: React.ReactNode;
    value: string;
    disabled?: boolean | undefined;
  }>({
    value: DEFAULT_CATEGORY_ID,
    label: (
      <span>{selectHelper.selectCategory(DEFAULT_CATEGORY_ID)?.title}</span>
    ),
  });

  const categoryTreeData: NonNullable<TreeSelectProps["treeData"]> = [
    { key: DEFAULT_CATEGORY_ID, title: config.defaultCategory.title },
  ].concat(transformTreeData(selectHelper.getTreeOf("categories")) as any);

  const handleUrlChange = (url: string) => {
    setUrl(url);
    if (url.length > 0) {
      setIsButtonEnable(true);
    } else {
      setIsButtonEnable(false);
    }
    try {
      const urlWithProtocol =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : "http://" + url;
      parseUrl(urlWithProtocol);
    } catch (error) {
      setIsButtonEnable(false);
    }
  };

  const handleSave = () => {
    const id = nanoid();
    const urlWithProtocol =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : "http://" + url;
    const hostname = parseUrl(urlWithProtocol).resource;
    updateRecord(id, {
      id: id,
      url: urlWithProtocol,
      title: hostname,
      createdAt: getTimestamp(),
      deletedAt: undefined,
      category: selectedCategory.value,
    });
    setUrl("");
    setIsButtonEnable(false);

    onSave && onSave(id);

    addLoadingBookmarks(id);
    httpHelper
      .getMetaOfWebsite(urlWithProtocol)
      .then((res) => {
        if (res?.title && res.title.length > 0)
          updateField(id, "title", res.title);
      })
      .catch((err) => {
        Message.error(err.message);
      })
      .finally(() => {
        removeLoadingBookmarks(id);
      });
    httpHelper.getIconOfWebsite(urlWithProtocol).then(async (res) => {
      if (!res) return;
      const iconId = await saveBlob("iconBlob", res);
      updateField(id, "icon", iconId);
    });
  };

  const handleOpenDashboard = () => {
    window.open("index.html?page=dashboard");
  };

  return (
    <StyledContent>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Text>URL</Typography.Text>
        <Input
          value={url}
          onChange={handleUrlChange}
          placeholder="http://"
          onPressEnter={handleUrlChange}
        />

        <Typography.Text>分类</Typography.Text>
        <TreeSelect
          labelInValue
          treeData={categoryTreeData}
          value={selectedCategory}
          onChange={(v) => {
            setSelectedCategory({
              value: v.value,
              label: <span>{v.label}</span>,
            });
          }}
        />

        {!config.backendURL && (
          <Alert type="warning" content="配置后端地址后可自动读取站点信息" />
        )}

        <Space className="footer">
          {fromExtension && (
            <Button type="text" onClick={handleOpenDashboard}>
              打开管理页
            </Button>
          )}
          <Button
            disabled={!isButtonEnable}
            type="primary"
            className="button"
            onClick={handleSave}
          >
            保存
          </Button>
        </Space>
      </Space>
    </StyledContent>
  );
};

function transformTreeData<T extends Category | Tag>(
  treeData: TreeOf<T>[]
): NonNullable<TreeSelectProps["treeData"]> {
  return treeData.map((item) => {
    const { children, title, id: key } = item;
    return {
      title,
      key,
      children:
        children && children.length > 0 ? transformTreeData(children) : [],
    };
  });
}
