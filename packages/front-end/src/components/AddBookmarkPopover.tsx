import { Button, Popover } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { useState } from "react";
import { AddBookmark } from "./AddBookmark";

export const AddBookmarkPopover = () => {
  const [visible, setVisible] = useState(false);

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
