import styled from "styled-components";
import { useConfig } from "../hooks";

const StyledCategoryInfo = styled.span`
  color: var(--color-text-2);
  user-select: none;

  span:nth-child(1) {
    margin-right: 5px;
  }
`;

type Props = {
  category?: Category;
};

export const CategoryInfo = ({ category }: Props) => {
  const { config } = useConfig();
  if (!category) {
    return (
      <StyledCategoryInfo>
        <span>{config.defaultCategory.icon}</span>
        <span>{config.defaultCategory.title}</span>
      </StyledCategoryInfo>
    );
  }
  return (
    <StyledCategoryInfo>
      <span>{category.icon}</span>
      <span>{category.title}</span>
    </StyledCategoryInfo>
  );
};
