import { Dropdown, Menu } from "@arco-design/web-react";
import { Share } from "./share";
import { useRef, useState } from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
  entityId: ID;
  entityType: "categories" | "tag";
  isShareDisabled?: boolean;
};

export const RightClickContentMenu = ({
  children,
  entityId,
  entityType,
  isShareDisabled,
}: Props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const refMenuItemClicked = useRef<string | null>(null);

  return (
    <Dropdown
      unmountOnExit={false}
      trigger={"contextMenu"}
      position="bl"
      popupVisible={popupVisible}
      onVisibleChange={(visible) => {
        if (refMenuItemClicked.current === "share") return;

        setPopupVisible(visible);
      }}
      droplist={
        <Menu
          onClickMenuItem={(key) => {
            refMenuItemClicked.current = key;
          }}
        >
          <Share
            entityId={entityId}
            entityType={entityType}
            disabled={isShareDisabled}
            onDone={() => setPopupVisible(false)}
          />
        </Menu>
      }
    >
      {children}
    </Dropdown>
  );
};
