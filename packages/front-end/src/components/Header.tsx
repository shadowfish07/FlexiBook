import { Button, Popover, Space } from "@arco-design/web-react";
import Header from "@arco-design/web-react/es/Layout/header";
import { IconSettings } from "@arco-design/web-react/icon";
import { memo, useContext, useState } from "react";
import { AddBookmarkPopover, Config } from ".";
import { useSavingState } from "../store/useSavingState";
import { pick } from "lodash";

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
      <div>{isSavingLocal && <span>保存中(本地)</span>}</div>
      <Space>
        <Config
          renderButton={(openDrawer) => (
            <Button type="text" icon={<IconSettings />} onClick={openDrawer} />
          )}
        />

        <AddBookmarkPopover />
      </Space>
    </Header>
  );
});
