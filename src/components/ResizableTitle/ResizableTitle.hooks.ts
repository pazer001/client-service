import { TableProps } from 'antd'
import { useState } from 'react'
import { ISymbolTableItem } from '../SymbolTable/SymbolTable.types'

interface IReturnUseResizableTitle {
  columns: TableProps<ISymbolTableItem>['columns']
}

export const useResizableTitle = (originColumns: TableProps<ISymbolTableItem>['columns']): IReturnUseResizableTitle => {
  const [columns, setColumns] = useState<TableProps<ISymbolTableItem>['columns']>(
    originColumns?.map((column, index) => {
      if (column.width) {
        return {
          ...column,
          onHeaderCell: (col) => ({
            width: col.width,
            onResize: handleResize(index),
          }),
        }
      }

      return column
    }),
  )

  function handleResize(index: number) {
    return (_e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
      setColumns((prevColumns) => {
        const nextColumns = [...(prevColumns || [])]
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        }
        return nextColumns
      })
    }
  }

  return {
    columns,
  }
}
