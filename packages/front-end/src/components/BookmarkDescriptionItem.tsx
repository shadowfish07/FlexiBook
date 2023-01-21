import styled from "styled-components";
import { useConfig } from "../hooks";

const StyledBookmarkDescriptionItem = styled.span`
  color: var(--color-text-2);
  user-select: none;

  &:not(:last-child)::after {
    content: "·";
    text-align: center;
    width: 20px;
    display: inline-block;
  }
`;

type Props = {
  children: React.ReactNode;
};

export const BookmarkDescriptionItem = ({ children }: Props) => {
  return (
    <StyledBookmarkDescriptionItem>{children}</StyledBookmarkDescriptionItem>
  );
};
