import styled from "styled-components";
import { CaretDown } from "./CaretDown";
import { useState } from "react";

const StyledShareContentItem = styled.div`
  display: inline-block;

  .title {
    user-select: none;
    vertical-align: middle;
    margin-left: 5px;
  }
`;

type Props = {
  shareContent: SharedContent;
  onToggleFold: () => void;
};

export const SharedContentItem = ({ shareContent, onToggleFold }: Props) => {
  const [isFolding, setIsFolding] = useState(false);

  const handleToggleFold = () => {
    onToggleFold();
  };

  return (
    <StyledShareContentItem>
      <CaretDown
        isFolding={isFolding}
        isParent={true}
        onToggleFold={handleToggleFold}
      />

      <span className="title">
        {shareContent.nickname || "不愿透露姓名的网友"}
      </span>
    </StyledShareContentItem>
  );
};
