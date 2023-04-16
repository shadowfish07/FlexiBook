import { Space } from "@arco-design/web-react";
import { useState } from "react";
import styled from "styled-components";

type Props = {
  defaultEditMode?: boolean;
  renderDefault: () => JSX.Element;
  renderEdit: () => JSX.Element;
  renderConfirmButton: (resolve: () => void) => JSX.Element;
};

const StyledEditContainer = styled.div`
  width: 100%;

  .arco-space,
  .arco-space-item:nth-child(1),
  input {
    width: 100%;
  }
`;

const StyledDefaultContainer = styled.div`
  & * {
    cursor: pointer;
  }
`;

export const EditInPlace = ({
  defaultEditMode,
  renderDefault,
  renderEdit,
  renderConfirmButton,
}: Props) => {
  const [isEditing, setIsEditing] = useState(defaultEditMode);
  const resolve = () => setIsEditing(false);

  const Edit = () => {
    return (
      <StyledEditContainer>
        <Space>
          {renderEdit()}
          {renderConfirmButton(resolve)}
        </Space>
      </StyledEditContainer>
    );
  };

  const Default = () => {
    return (
      <StyledDefaultContainer onDoubleClick={() => setIsEditing(true)}>
        {renderDefault()}
      </StyledDefaultContainer>
    );
  };

  return isEditing ? <Edit /> : <Default />;
};
