// import { useState } from "react";
import { ISymbol } from '../../stores/symbolStore'
import { ResizableTitle } from '../ResizableTitle/ResizableTitle'
import { useResizableTitle } from '../ResizableTitle/ResizableTitle.hooks'
import { useSymbolTable } from './SymbolTable.hooks'
import { ISymbolTableItem } from './SymbolTable.types'

import { Space, Table, Avatar, Typography } from 'antd'
import type { TableProps } from 'antd'

import './SymbolTable.css'

const originColumns: TableProps<ISymbolTableItem>['columns'] = [
  {
    key: 'symbol',
    title: 'Symbol',
    dataIndex: 'symbol',
    width: 120,
    ellipsis: true,
    render(_col, { logo, symbol }: ISymbol) {
      return (
        <Space>
          <Avatar size={24}>
            <img src={logo !== '' ? logo : undefined} alt={symbol} />
          </Avatar>
          <Typography.Text ellipsis>{symbol}</Typography.Text>
        </Space>
      )
    },
  },
  {
    key: 'marketCapitalization',
    title: 'Market Cap',
    dataIndex: 'marketCapitalization',
    width: 100,
    ellipsis: true,
  },
  {
    key: 'recommendation',
    title: 'Score',
    dataIndex: 'priorityScore',
    ellipsis: true,
  },
]

export const SymbolTable = () => {
  const { isLoading, data } = useSymbolTable()
  const { columns } = useResizableTitle(originColumns)
  // const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
  //   [],
  // );

  console.log(originColumns)

  return (
    <Table
      className="table-demo-resizable-column"
      loading={isLoading}
      dataSource={data}
      columns={columns}
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
    />
  )
}
