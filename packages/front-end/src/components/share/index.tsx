import {
  Button,
  Drawer,
  List,
  Space,
  Tooltip,
  Typography,
} from "@arco-design/web-react";
import {
  IconDelete,
  IconShareAlt,
  IconUser,
} from "@arco-design/web-react/icon";
import { ReactNode, useState } from "react";
import { ParsedInvitation, useOauth } from "../../hooks/useOauth";
import { CategoryInfo } from "../CategoryInfo";
import { TagInfo } from "../TagInfo";
import styled from "styled-components";

const StyledShareList = styled.div`
  .arco-list-item-action {
    align-self: flex-start;
  }
`;

export const Share = () => {
  const [visible, setVisible] = useState(false);
  const { invitations, getShareURL } = useOauth();
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
                <Typography.Text>{nickname || clientId}</Typography.Text>
              </Space>
            );
          })}
        </Space>
      );
    };

    const shareURL = getShareURL(item.id);

    return (
      <List.Item key={index} actions={actions}>
        {renderEntities()}
        <Tooltip content={shareURL}>
          <Typography.Text
            type="secondary"
            copyable
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {shareURL}
            </span>
          </Typography.Text>
        </Tooltip>

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
        <StyledShareList>
          <List
            header="我的分享"
            dataSource={invitations}
            render={renderInvitation.bind(null, [<IconDelete />])}
          />
        </StyledShareList>
      </Drawer>
    </>
  );
};
