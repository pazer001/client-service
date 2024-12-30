import { Card, List } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { create } from "zustand";
// import GridLayout from "react-grid-layout";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";

interface IMainStore {
  symbols: string[];
  addStock: (symbol: string) => void;
  removeAllStocks: () => void;
}

const useTradingStore = create<IMainStore>((set) => ({
  symbols: ["AAPL", "GOOGL", "AMZN"],
  addStock: (symbol: string) =>
    set((state) => ({ symbols: [...state.symbols, symbol] })),
  removeAllStocks: () => set({ symbols: [] }),
}));
const layout = [
  { i: "a", x: 0, y: 0, w: 5, h: 10, static: true },
  { i: "b", x: 5, y: 0, w: 3, h: 10 },
  { i: "c", x: 10, y: 0, w: 4, h: 10, minW: 2, maxW: 4 },
];
const layouts = { lg: layout };
function App() {
  const [rowHeight, setRowHeight] = useState(0);
  const mainStore = useTradingStore();
  useEffect(() => {
    document.body.setAttribute("arco-theme", "dark");
    setRowHeight(document.body.clientHeight);
  }, []);
  return (
    <>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={rowHeight}
        width={document.body.clientWidth}
      >
        <div key="a">
          <Card title="Arco Card">
            news recommendation engine and gradually evolved into a platform
            delivering content in various formats.
          </Card>
        </div>
        <div key="b">
          <Card title="Arco Card">
            news recommendation engine and gradually evolved into a platform
            delivering content in various formats.
          </Card>
        </div>
        <div key="c">
          <Card title="Arco Card">
            <List
              header="Symbols"
              dataSource={mainStore.symbols}
              render={(item, index) => (
                <List.Item key={index}>{item}</List.Item>
              )}
            />
          </Card>
        </div>
      </ResponsiveGridLayout>
    </>
  );
}

export default App;
