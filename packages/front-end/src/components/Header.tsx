import { Button, Popover, Space } from "@arco-design/web-react";
import Header from "@arco-design/web-react/es/Layout/header";
import { IconSettings } from "@arco-design/web-react/icon";
import { memo, useContext, useState } from "react";
import { AddBookmark, Config } from ".";
import { SavingContext } from "../main";

export default memo(() => {
  const { isSaving, setIsSaving } = useContext(SavingContext);
  const [visible, setVisible] = useState(false);

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
      <div>{isSaving && <span>保存中</span>}</div>
      <Space>
        <Config
          renderButton={(openDrawer) => (
            <Button type="text" icon={<IconSettings />} onClick={openDrawer} />
          )}
        />

        <AddBookmark />
      </Space>
    </Header>
  );
});
