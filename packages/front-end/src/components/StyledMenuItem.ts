import styled from "styled-components";

export const StyledMenuItem = styled.span`
  &.is-dragging > .arco-menu-item,
  &.is-dragging > .arco-menu-inline > .arco-menu-inline-header {
    box-shadow: inset 0 0 0 2px rgb(14, 50, 166);
    background-color: rgba(14, 50, 166, 0.1);
    transition: box-shadow 0.1s linear, background 0.1s linear;
  }

  & .arco-menu-inline-header {
    padding-right: 12px;
  }
`;
