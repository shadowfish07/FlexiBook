import styled from "styled-components";

type Props = {
  tag: Tag;
  onClick?: (tag: Tag) => void;
};

const StyledTag = styled.div<{ color: string }>`
  display: inline-block;
  margin-right: 10px;

  .color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    display: inline-block;
  }

  .name {
    margin-left: 5px;
  }
`;

export const Tag = ({ tag, onClick }: Props) => {
  return (
    <StyledTag color={tag.color} onClick={() => onClick && onClick(tag)}>
      <span className="color" />
      <span className="name">{tag.name}</span>
    </StyledTag>
  );
};
