import { Menu, Message, Modal, Spin } from "@arco-design/web-react";
import { useConfig } from "../../hooks";
import { isString, set } from "lodash";
import { useState } from "react";
import { useOauth } from "../../hooks/useOauth";
import copy from "copy-to-clipboard";

type Props = {
  entityId: ID;
  entityType: "categories" | "tag";
  disabled?: boolean;
  onDone?: () => void;
};

export const Share = ({
  entityId,
  entityType,
  disabled: propDisabled,
  onDone,
}: Props) => {
  const { httpHelper } = useConfig();
  const { getShareURL, loadRemoteData, findInvitation } = useOauth();
  const [loading, setLoading] = useState(false);
  const [modal, modelContextHolder] = Modal.useModal();

  const entityInvitation = findInvitation(entityId);
  const disabled = propDisabled || loading;

  const handleShare = async (e: MouseEvent) => {
    if (entityInvitation) {
      copy(getShareURL(entityInvitation.id));
      Message.success("分享链接已复制到剪贴板");
      return;
    }

    e.stopPropagation();
    setLoading(true);
    let id: string;
    try {
      if (entityType === "categories") {
        id = await httpHelper.addShareInvitation({
          entity: entityType,
          entityId,
          allowEdit: false,
        });

        await loadRemoteData();

        modal.success?.({
          title: "分享成功",
          content: "分享链接：" + getShareURL(id),
        });
      }
    } catch (error) {
      if (isString(error)) {
        Message.error(error);
      }
    } finally {
      setLoading(false);
      onDone && onDone();
    }
  };

  return (
    <>
      {modelContextHolder}
      <Menu.Item onClick={handleShare} key="share" disabled={disabled}>
        {!!entityInvitation ? "复制分享链接" : "分享"}
        <Spin
          delay={500}
          style={{
            marginLeft: 10,
            paddingRight: 5,
            visibility: loading ? "visible" : "hidden",
          }}
        />
      </Menu.Item>
    </>
  );
};
