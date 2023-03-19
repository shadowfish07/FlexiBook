import { Space } from "@arco-design/web-react";
import { IconCheck } from "@arco-design/web-react/icon";
import { useState } from "react";
import styled from "styled-components";

const StyledColorItem = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    box-shadow: 0 0 0 2px #eaf4ff;
  }
`;

const StyledColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;
`;

type ColorPickerProps = {
  onSelect?: (color: string) => void;
  defaultColor?: string;
};

type ColorItemProps = {
  color: string;
  isSelected: boolean;
  onClick: (color: string) => void;
};

export function ColorPicker({ defaultColor, onSelect }: ColorPickerProps) {
  const colors = [
    "#CB2E34",
    "#CC5729",
    "#D26913",
    "#CC961F",
    "#CFB325",
    "#84B723",
    "#129A37",
    "#1FA6AA",
    "#2971CF",
    "#1D4DD2",
    "#5A25B0",
    "#B01BB6",
    "#CB2B88",
  ];

  const [selectedColor, setSelectedColor] = useState<string>(
    defaultColor ?? colors[0]
  );

  const ColorItem = ({ color, isSelected, onClick }: ColorItemProps) => {
    return (
      <StyledColorItem color={color} onClick={() => onClick(color)}>
        {isSelected && <IconCheck style={{ color: "#ffffff" }} />}
      </StyledColorItem>
    );
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    onSelect && onSelect(color);
  };

  return (
    <StyledColorPicker>
      <Space wrap size={6}>
        {colors.map((color) => (
          <ColorItem
            color={color}
            onClick={handleColorClick}
            isSelected={selectedColor === color}
          />
        ))}
      </Space>
    </StyledColorPicker>
  );
}
