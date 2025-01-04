export interface ResizableTitleProps {
  onResize: (
    e: React.SyntheticEvent,
    data: { size: { width: number; height: number } },
  ) => void
  width: number
}

export interface CustomResizeHandleProps {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | React.Ref<HTMLSpanElement>
}
