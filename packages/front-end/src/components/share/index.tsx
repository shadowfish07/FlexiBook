import {
  Button,
  Drawer,
  List,
  Space,
  Typography,
} from "@arco-design/web-react";
import {
  IconDelete,
  IconShareAlt,
  IconUser,
} from "@arco-design/web-react/icon";
import { ReactNode, useState } from "react";
import {
  ParsedInvitation,
  UseOauthReturnType,
  useOauth,
} from "../../hooks/useOauth";
import { CategoryInfo } from "../CategoryInfo";
import { TagInfo } from "../TagInfo";
import { useConfig } from "../../hooks";

export const Share = () => {
  const { config } = useConfig();
  const [visible, setVisible] = useState(false);
  const { invitations } = useOauth();
  console.log("🚀 ~ file: index.tsx:9 ~ Share ~ invitations:", invitations);
  const openDrawer = () => {
    setVisible(true);
  };

  const hideDrawer = () => {
    setVisible(false);
  };

  const renderInvitation = (
    actions: ReactNode[],
    item: ParsedInvitation,
    index: number
  ) => {
    const renderEntities = () => {
      return (
        <Space style={{ display: "block" }}>
          {item.permissions.map(({ entity, entityType }) => {
            switch (entityType) {
              case "categories":
                return <CategoryInfo category={entity} />;
              case "tags":
                return <TagInfo tag={entity} />;
              default:
                return null;
            }
          })}
        </Space>
      );
    };

    const renderUsers = () => {
      return (
        <Space style={{ display: "block" }} direction="vertical">
          {item.users.map(({ nickname, clientId, createdAt }) => {
            return (
              <Space>
                <IconUser />
                <Typography.Text>{nickname || clientId}</Typography.Text>;
              </Space>
            );
          })}
        </Space>
      );
    };

    const shareURL = `${config.backendURL}/invitation/${item.id}`;

    return (
      <List.Item key={index} actions={actions}>
        {renderEntities()}
        <Typography.Text type="secondary" copyable style={{ display: "block" }}>
          {shareURL}
        </Typography.Text>
        {item.users.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <Typography.Text type="secondary">共享给</Typography.Text>
            {renderUsers()}
          </div>
        )}
      </List.Item>
    );
  };

  return (
    <>
      <Button type="text" icon={<IconShareAlt />} onClick={openDrawer} />
      <Drawer
        width={"30%"}
        title={<span>分享</span>}
        visible={visible}
        autoFocus={false}
        onOk={hideDrawer}
        onCancel={hideDrawer}
        unmountOnExit
        footer={null}
      >
        <List
          header="我的分享"
          dataSource={invitations}
          render={renderInvitation.bind(null, [<IconDelete />])}
        />
      </Drawer>
    </>
  );
};
