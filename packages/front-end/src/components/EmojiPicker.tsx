import styled from "styled-components";
import data from "@emoji-mart/data";
// @ts-ignore
import Picker from "@emoji-mart/react";
import i18n from "../assets/emoji-mart-i18n-zh.json";

type Props = {
  position: { x: number; y: number };
  onSelect: (emoji: Emoji) => void;
  onHide: () => void;
};

const StyledMask = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const StyledPickerWrapper = styled.div<{ position: { x: number; y: number } }>`
  position: absolute;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

export const EmojiPicker = ({ position, onSelect, onHide }: Props) => {
  return (
    <StyledMask onClick={onHide}>
      <StyledPickerWrapper
        position={position}
        onClick={(e) => e.stopPropagation()}
      >
        <Picker
          i18n={i18n}
          locale={"zh"}
          data={data}
          onEmojiSelect={onSelect}
          previewPosition={"none"}
        />
      </StyledPickerWrapper>
    </StyledMask>
  );
};
