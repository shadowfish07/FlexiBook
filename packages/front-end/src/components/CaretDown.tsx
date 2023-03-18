import { IconCaretDown } from "@arco-design/web-react/icon";
import { SyntheticEvent, useEffect, useState } from "react";

type Props = {
  isFolding?: boolean;
  isParent?: boolean;
  onToggleFold?: () => void;
};

export const CaretDown = ({ isFolding, isParent, onToggleFold }: Props) => {
  const [_isFolding, setIsFolding] = useState(isFolding || false);
  const handleToggleFold = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsFolding(!_isFolding);
    onToggleFold && onToggleFold();
  };

  useEffect(() => {
    setIsFolding(isFolding || false);
  }, [isFolding]);

  return (
    <>
      {isParent ? (
        <IconCaretDown
          style={{
            marginRight: 0,
            transform: _isFolding ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "rotate 0.3s",
          }}
          onClick={handleToggleFold}
        />
      ) : (
        <span
          style={{ width: "1em", height: "1em", display: "inline-block" }}
        />
      )}
    </>
  );
};
