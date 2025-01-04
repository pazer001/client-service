import { useState } from "react";
import { TableColumnProps } from "@arco-design/web-react";

interface IReturnUseResizableTitle {
  columns: TableColumnProps[];
}

export const useResizableTitle = (originColumns: TableColumnProps[]): IReturnUseResizableTitle => {
  const [columns, setColumns] = useState<TableColumnProps[]>(
    originColumns.map((column, index) => {
      if (column.width) {
        return {
          ...column,
          onHeaderCell: (col: TableColumnProps) => ({
            width: col.width,
            onResize: handleResize(index),
          }),
        };
      }

      return column;
    })
  );

  function handleResize(index: number) {
    return (_e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
      setColumns((prevColumns) => {
        const nextColumns = [...prevColumns];
        nextColumns[index] = { ...nextColumns[index], width: size.width };
        return nextColumns;
      });
    };
  }

  return {
    columns,
  }
}