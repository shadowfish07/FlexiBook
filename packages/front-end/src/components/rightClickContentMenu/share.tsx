import { Menu, Message, Modal, Spin } from "@arco-design/web-react";
import { useConfig } from "../../hooks";
import { isString, set } from "lodash";
import { useState } from "react";

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
  const { config, httpHelper } = useConfig();
  const [loading, setLoading] = useState(false);
  const [modal, modelContextHolder] = Modal.useModal();

  const disabled = propDisabled || loading;

  const handleShare = async (e: MouseEvent) => {
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

        modal.success?.({
          title: "分享成功",
          content:
            "分享链接：" + config.backendURL + "/invitation/activate/" + id,
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
        分享
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
