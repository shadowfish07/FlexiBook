import { Menu } from "@arco-design/web-react";
import { StyledMenuItem } from "./StyledMenuItem";
import { SharedContentItem } from "./SharedContentItem";
import md5 from "md5";

type Props = {
  children: JSX.Element | JSX.Element[];
  sharedContent: SharedContent;
  onToggleFold: () => void;
};

export const SharedContentSubMenu = ({
  children,
  sharedContent,
  onToggleFold,
}: Props) => {
  return (
    <StyledMenuItem key={`sharedContents-${sharedContent.url}`}>
      <Menu.SubMenu
        level={1}
        _key={`sharedContents-${sharedContent.url}`}
        key={`sharedContents-${sharedContent.url}`}
        title={
          <SharedContentItem
            shareContent={sharedContent}
            onToggleFold={onToggleFold}
          />
        }
        data-id={sharedContent.url}
        data-type="SubMenu"
        selectable
      >
        {children}
      </Menu.SubMenu>
    </StyledMenuItem>
  );
};
