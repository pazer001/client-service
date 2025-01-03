import { useState, useEffect } from "react";
import { useSymbolStore } from "../../stores/symbolStore";
import type { ISymbolTableItem } from "./SymbolTable.types";

interface IReturnSymbolTableHook {
    isLoading: boolean;
    data: ISymbolTableItem[];
}

/**
 * Custom hook to fetch and manage symbol table data.
 * 
 * @returns {IReturnSymbolTableHook} An object containing loading state and symbol table data.
 */
export const useSymbolTable = (): IReturnSymbolTableHook => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ISymbolTableItem[]>([]);
    const {getSuggestedSymbols, symbols} = useSymbolStore();
    
    useEffect(() => {
      setIsLoading(true);
      getSuggestedSymbols().finally(() => setIsLoading(false));
    }, []);
  
    useEffect(() => {
      // table data must have a unique key property for row selections
      setData(symbols.map((item) => ({...item, key: item.symbol})));
    }, [symbols.length]);

    return {
        isLoading,
        data,
    }
}