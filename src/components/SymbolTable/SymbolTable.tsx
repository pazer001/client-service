import { useState } from 'react'
import { ISymbol } from '../../stores/symbolStore'
import { ResizableTitle } from '../ResizableTitle/ResizableTitle'
import { useResizableTitle } from '../ResizableTitle/ResizableTitle.hooks'
import { useSymbolTable } from './SymbolTable.hooks'

import { Space, Table, Avatar, Typography } from 'antd'
import type { TableProps } from 'antd'

import './SymbolTable.css'

const originColumns: TableProps<ISymbol>['columns'] = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    width: 80,
    ellipsis: true,
    render(_col, { logo, symbol }: ISymbol) {
      return (
        <Space>
          <Avatar src={logo} size={24} alt={symbol}>
            <Typography.Text>{symbol.slice(0, 1).toUpperCase()}</Typography.Text>
          </Avatar>
          <Typography.Text ellipsis>{symbol}</Typography.Text>
        </Space>
      )
    },
  },
  {
    title: 'Market Cap',
    dataIndex: 'marketCapitalization',
    width: 100,
    ellipsis: true,
  },
  {
    title: 'Score',
    dataIndex: 'priorityScore',
    ellipsis: true,
  },
]

export const SymbolTable = () => {
  const { isLoading, data } = useSymbolTable()
  const { columns } = useResizableTitle(originColumns)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  return (
    <Table
      className="table-demo-resizable-column"
      loading={isLoading}
      dataSource={data}
      columns={columns}
      rowSelection={{
        selectedRowKeys,
        onChange: setSelectedRowKeys,
      }}
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
    />
  )
}
