import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { DnDTypes } from "../constants";

type WithDropProps = {
  isDraggingOver?: boolean;
};

type RefHandle = {
  handleDrop: () => void;
};

export function withDrop<T extends object>(
  WrappedComponents: React.ForwardRefExoticComponent<T>
) {
  return function (props: T & WithDropProps) {
    const [{ isDraggingOver }, dropRef] = useDrop(() => ({
      accept: DnDTypes.Bookmark,
      drop: () => {
        ref.current?.handleDrop && ref.current?.handleDrop();
      },
      collect: (monitor) => ({
        isDraggingOver: !!monitor.isOver(),
      }),
    }));
    const ref = useRef<RefHandle>(null);

    return (
      <span ref={dropRef}>
        <WrappedComponents
          ref={ref}
          {...props}
          isDraggingOver={isDraggingOver}
        />
      </span>
    );
  };
}
