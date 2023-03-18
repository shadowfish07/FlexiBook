import { Popover, Button } from "@arco-design/web-react";
import { IconPlus, IconTag } from "@arco-design/web-react/icon";
import { useState } from "react";
import { AddBookmark } from "./AddBookmark";
import { AddTag } from "./AddTag";

type Props = {
  bookmarkId: ID;
};

export function AddTagPopover({ bookmarkId }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      position="bl"
      popupVisible={visible}
      onVisibleChange={(visible) => setVisible(visible)}
      trigger="click"
      style={{ width: 268 }}
      content={
        <AddTag onSave={() => setVisible(false)} bookmarkId={bookmarkId} />
      }
    >
      <Button size="mini" type="text" icon={<IconTag />}></Button>
    </Popover>
  );
}
