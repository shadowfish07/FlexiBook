import styled from "styled-components";
import { useStorage } from "../hooks";
import { CaretDown } from "./CaretDown";
import { InPlaceInput } from "./InPlaceInput";

type Props = {
  tag: Tag;
};

const StyledTagItem = styled.div<{ color: string }>`
  display: inline-block;

  .title {
    user-select: none;
    vertical-align: middle;
  }

  .color {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    display: inline-block;
    vertical-align: middle;
    margin-left: 6px;
    margin-right: 12px;
  }
`;

export const TagItem = ({ tag }: Props) => {
  const { updateField } = useStorage({ useKey: "tags" });

  const handleSaveTitle = (title: string) => {
    updateField(tag.id, "title", title);
  };

  return (
    <StyledTagItem color={tag.color} data-id={tag.id}>
      <CaretDown />

      <span className="color" />

      <InPlaceInput
        text={tag.title}
        textClassName="title"
        placeholder="输入标签名"
        onSave={handleSaveTitle}
      />
    </StyledTagItem>
  );
};
