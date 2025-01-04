import { useEffect, useState } from "react";
import { Card } from "@arco-design/web-react";
// import GridLayout from "react-grid-layout";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { useSymbolStore } from "./stores/symbolStore";

import "react-grid-layout/css/styles.css";
import { SymbolTable } from "./components/SymbolTable/SymbolTable";

const layout = [
  { i: "a", x: 0, y: 0, w: 7, h: 12 },
  { i: "b", x: 7, y: 0, w: 2, h: 12 },
  { i: "c", x: 9, y: 0, w: 3, h: 12 },
];

const layouts = { lg: layout };
function App() {
  const [rowHeight, setRowHeight] = useState(0);
  const mainStore = useSymbolStore();

  useEffect(() => {
    document.body.setAttribute("arco-theme", "dark");
    console.log(mainStore.getSuggestedSymbols());
    setRowHeight(window.innerHeight / 100);
  }, []);

  console.log(mainStore.symbols);

  return (
    <>
      <ResponsiveGridLayout
        layouts={layouts}
        isDraggable={false}
        autoSize={false}
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
          <SymbolTable />
        </div>
      </ResponsiveGridLayout>
    </>
  );
}

export default App;
