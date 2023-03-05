import {
  Alert,
  Button,
  Input,
  Message,
  Popover,
  Space,
  Typography,
} from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { nanoid } from "nanoid";
import parseUrl from "parse-url";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useConfig, useStorage } from "../hooks";
import { useBookmarkLoadState } from "../store/useBookmarkLoadState";
import { useSideMenuState } from "../store/useSideMenuState";
import { saveBlob } from "../utils";
import { AddBookmark } from "./AddBookmark";

const StyledContent = styled.div`
  .footer {
    display: flex;
    justify-content: flex-end;
  }
`;

export const AddBookmarkPopover = () => {
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState("");
  const { updateRecord, updateField } = useStorage({
    useKey: "bookmarks",
  });
  const { config, httpHelper } = useConfig();
  const [addLoadingBookmarks, removeLoadingBookmarks] = useBookmarkLoadState(
    (state) => [state.addLoadingBookmarks, state.removeLoadingBookmarks]
  );
  const [isButtonEnable, setIsButtonEnable] = useState(false);
  const [selectedId, selectedType] = useSideMenuState((state) => [
    state.selectedId,
    state.selectedType,
  ]);

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
      createdAt: new Date().getTime(),
      deletedAt: undefined,
      category: selectedType === "categories" ? selectedId : undefined,
    });
    setVisible(false);
    setUrl("");
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

  useEffect(() => {
    return () => {
      setUrl("");
    };
  }, []);

  return (
    <Popover
      position="bl"
      popupVisible={visible}
      onVisibleChange={(visible) => setVisible(visible)}
      trigger="click"
      style={{ width: 330 }}
      content={<AddBookmark onSave={() => setVisible(false)} />}
    >
      <Button type="primary" icon={<IconPlus />}>
        添加
      </Button>
    </Popover>
  );
};
