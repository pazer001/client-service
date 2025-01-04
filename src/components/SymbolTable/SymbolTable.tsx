import { useState } from 'react';
import { Avatar, Table, TableColumnProps } from '@arco-design/web-react';
import { ISymbol } from '../../stores/symbolStore';
import './SymbolTable.css';
import { ResizableTitle } from '../ResizableTitle/ResizableTitle';
import { useResizableTitle } from '../ResizableTitle/ResizableTitle.hooks';
import { useSymbolTable } from './SymbolTable.hooks';
import { RowSelectionProps } from '@arco-design/web-react/es/Table';
import { ISymbolTableItem } from './SymbolTable.types';

const originColumns: TableColumnProps[] = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    width: 100,
    ellipsis: true,
  },
  {
    title: 'Logo',
    render: (_col, {logo, symbol}: ISymbol) => <Avatar size={24}><img src={logo} alt={symbol} /></Avatar>,
    dataIndex: 'logo',
    width: 100,
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
];


const components = {
  header: {
    th: ResizableTitle,
  },
};

export const SymbolTable = () => {
  const {isLoading, data} = useSymbolTable();
  const {columns} = useResizableTitle(originColumns);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

  const rowSelection: RowSelectionProps<ISymbolTableItem> = {
    selectedRowKeys,
    onChange: (selectedRowKeys: (string | number)[], selectedRows: ISymbol[]) => {
      console.log('selectedRowKeys', selectedRowKeys);
      console.log('selectedRows', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
  };

  return (
    <Table
      className={'table-demo-resizable-column'}
      loading={isLoading}
      columns={columns} 
      components={components}
      data={data}
      border
      rowSelection={rowSelection}
    />
  );
}