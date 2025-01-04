import { Resizable } from 'react-resizable';
import type { ResizableTitleProps, CustomResizeHandleProps } from "./ResizableTitle.types";

const CustomResizeHandle = (props: CustomResizeHandleProps) => {
  const { handleAxis, ref, ...restProps } = props;
  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
      {...restProps}
      onClick={(e) => {
        e.stopPropagation();
      }}
    />
  );
}


export const ResizableTitle = (props: ResizableTitleProps) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={<CustomResizeHandle />}
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
