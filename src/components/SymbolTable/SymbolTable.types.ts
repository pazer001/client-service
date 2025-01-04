import { ISymbol } from "../../stores/symbolStore";

export interface ISymbolTableItem extends ISymbol {
  key: string;
}