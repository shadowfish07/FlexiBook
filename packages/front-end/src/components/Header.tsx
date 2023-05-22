import { Button, Input, Popover, Space } from "@arco-design/web-react";
import Header from "@arco-design/web-react/es/Layout/header";
import { IconSettings, IconShareAlt } from "@arco-design/web-react/icon";
import { memo, useContext, useState } from "react";
import { AddBookmarkPopover, Config } from ".";
import { useSavingState } from "../store/useSavingState";
import { pick } from "lodash";
import { SyncButton } from "./SyncButton";
import { useHeaderState } from "../store/useHeaderState";
import { Share } from "./share";

export default memo(() => {
  const { isSavingLocal } = useSavingState((state) =>
    pick(state, ["isSavingLocal"])
  );
  const { searchText, setSearchText } = useHeaderState((state) =>
    pick(state, ["searchText", "setSearchText"])
  );

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        position: "sticky",
        top: 0,
      }}
    >
      {/* <div className="left">{isSavingLocal && <span>保存中(本地)</span>}</div> */}
      <div className="left" style={{ width: "60%" }}>
        <Input.Search
          allowClear
          placeholder="搜索书签"
          style={{ width: "100%" }}
          onChange={handleSearchChange}
        />
      </div>
      <div className="right">
        <SyncButton />
        <Share />
        <Space>
          <Config
            renderButton={(openDrawer) => (
              <Button
                type="text"
                icon={<IconSettings />}
                onClick={openDrawer}
              />
            )}
          />

          <AddBookmarkPopover />
        </Space>
      </div>
    </Header>
  );
});
