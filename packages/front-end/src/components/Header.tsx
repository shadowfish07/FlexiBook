import { Button, Popover, Space } from "@arco-design/web-react";
import Header from "@arco-design/web-react/es/Layout/header";
import { IconSettings } from "@arco-design/web-react/icon";
import { memo, useContext, useState } from "react";
import { AddBookmarkPopover, Config } from ".";
import { useSavingState } from "../store/useSavingState";
import { pick } from "lodash";
import { SyncButton } from "./SyncButton";

export default memo(() => {
  const { isSavingLocal } = useSavingState((state) =>
    pick(state, ["isSavingLocal"])
  );

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingRight: 10,
      }}
    >
      <div className="left">{isSavingLocal && <span>保存中(本地)</span>}</div>
      <div className="right">
        <SyncButton />
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
