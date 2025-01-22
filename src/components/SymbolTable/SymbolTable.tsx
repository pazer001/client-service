import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { useSymbolTable } from './SymbolTable.hook.ts'

import { Column } from 'primereact/column'
import { Avatar } from 'primereact/avatar'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Button } from 'primereact/button'
import { Watchlist } from './Watchlist/Watchlist'
import { ISymbolItem } from './SymbolTable.interfaces.ts'
import { useSymbataStore } from '../../stores/symbataStore.ts'
import millify from 'millify'
import Verdict from '../Common/Verdict.tsx'
import { ProgressBar } from 'primereact/progressbar'

export interface ISymbolTableProps {
  interval: string
}

export const SymbolTable = (props: ISymbolTableProps) => {
  const { isLoading, symbols, analyzeSymbols, symbolsLooking, progress } = useSymbolTable(props)
  const { setSymbol } = useSymbataStore()
  // const [selectedSymbol, setSelectedSymbol] = useState<ISymbolItem[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value)
  }

  return (
    <DataTable
      // className="symbol-table"
      removableSort
      showGridlines
      scrollable
      pt={{
        root: { className: 'h-full' },
        // header: { className: 'border-none px-0 pt-0' },
        wrapper: { className: 'h-full' },
      }}
      paginator={symbols.length > 0}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="{first} to {last} of {totalRecords} Symbols"
      rows={200}
      scrollHeight={`calc(100% - 155px)`}
      value={symbols}
      loading={isLoading}
      resizableColumns
      size="small"
      selectionMode="single"
      // onSelectionChange={(e) => setSelectedSymbol(e.value as ISymbolItem[])}
      // selection={selectedSymbol}
      onRowClick={(e) => setSymbol(e.data.symbol)}
      globalFilter={globalFilter}
      filterDelay={400}
      header={() => (
        <div className="grid gap-2">
          <div className="col-12 pb-0">
            <Watchlist />
          </div>
          <div className="col-12 py-0 flex align-items-center gap-2">
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilter} onChange={handleSearchChange} placeholder="Search..." />
            </IconField>
            <Button
              label="Lookup"
              icon={symbolsLooking ? 'pi pi-spin pi-spinner' : 'pi pi-play-circle'}
              onClick={analyzeSymbols}
            />
          </div>

          {progress !== 0 && <ProgressBar value={progress} className="w-full ml-2 mr-2" />}
        </div>
      )}
    >
      {/*<Column selectionMode="multiple" resizeable={false} frozen></Column>*/}
      <Column
        field="symbol"
        header="Symbol"
        body={(rowData: ISymbolItem): React.ReactNode => {
          return (
            <div className="flex align-items-center gap-2">
              <Avatar image={rowData.logo} label={rowData.symbol.slice(0, 1).toUpperCase()} shape="circle" />
              <span>{rowData.symbol}</span>
            </div>
          )
        }}
        resizeable={false}
        frozen
        sortable
        filter
      />
      <Column
        field="score"
        header="Score"
        sortable
        filter
        filterPlaceholder="Between -100 to 100"
        dataType="numeric"
        body={(rowData: ISymbolItem): React.ReactNode =>
          rowData.analyzedSignalsAndLines
            ? parseInt(
                String(
                  rowData.analyzedSignalsAndLines.analyzedSignals[
                    rowData.analyzedSignalsAndLines.analyzedSignals.length - 1
                  ].signal,
                ),
              )
            : null
        }
      />

      <Column
        field="verdict"
        header="Verdict"
        sortable
        filter
        filterPlaceholder="Buy, Sell, Hold"
        dataType="text"
        body={(rowData: ISymbolItem): React.ReactNode =>
          rowData.analyzedSignalsAndLines ? (
            <Verdict
              score={
                rowData.analyzedSignalsAndLines.analyzedSignals[
                  rowData.analyzedSignalsAndLines.analyzedSignals.length - 1
                ].signal
              }
              minBuy={rowData.analyzedSignalsAndLines.lines.minBuy}
              minSell={rowData.analyzedSignalsAndLines.lines.minSell}
            />
          ) : null
        }
      />

      <Column
        field="marketCapitalization"
        header="Market Cap"
        sortable
        filter
        body={(rowData: ISymbolItem): React.ReactNode =>
          millify(rowData.marketCapitalization * 1000000, { precision: 0, space: true })
        }
      />
      <Column
        field="averageVolume"
        header="Avg Volume"
        sortable
        filter
        filterPlaceholder="Less than 50000"
        dataType="numeric"
      />
      {/*<Column field="priorityScore" header="Score" sortable filter />*/}
    </DataTable>
  )
}
