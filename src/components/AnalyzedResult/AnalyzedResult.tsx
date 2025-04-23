import { useSymbataStoreSymbol } from '../../stores/symbataStore.ts'
import { ISymbolItem } from '../../stores/symbataStore.types.ts'

const AnalyzedResult = () => {
  const symbol: ISymbolItem | undefined = useSymbataStoreSymbol()

  return (
    <div>
      {symbol ? (
        <>
          <p className="text-sm">Symbol: {symbol?.symbol}</p>
          <p className="text-sm">Sector Last Score: {symbol?.priorityScore?.sectorLastScore ?? 0}</p>
        </>
      ) : (
        <p className="text-sm">No symbol selected</p>
      )}
    </div>
  )
}

export default AnalyzedResult
