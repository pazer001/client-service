import { Button, List } from "@arco-design/web-react";
import { useEffect } from "react";
import { create } from "zustand";

interface IMainStore {
  symbols: string[];
  addStock: (stock: string) => void;
  removeAllStocks: () => void;
}

const useMainStore = create<IMainStore>((set) => ({
  symbols: ["AAPL", "GOOGL", "AMZN"],
  addStock: (stock: string) =>
    set((state) => ({ symbols: [...state.symbols, stock] })),
  removeAllStocks: () => set({ symbols: [] }),
}));

function App() {
  const mainStore = useMainStore();
  useEffect(() => {
    document.body.setAttribute("arco-theme", "dark");
  }, []);
  return (
    <>
      <List
        header="Symbols"
        dataSource={mainStore.symbols}
        render={(item, index) => <List.Item key={index}>{item}</List.Item>}
      />
      <Button onClick={() => mainStore.addStock("TSLA")}>Add TSLA</Button>
    </>
  );
}

export default App;
