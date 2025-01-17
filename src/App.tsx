import { useEffect } from 'react'
// import GridLayout from "react-grid-layout";
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { useSymbolStore } from './stores/symbolStore'
import { Card } from 'primereact/card'
import './App.css'
import 'primereact/resources/themes/lara-dark-cyan/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import 'primeflex/primeflex.css' // flex
import { SymbolTable } from './components/SymbolTable/SymbolTable'
import Algo from './components/Algo/Algo.tsx'

const layout = [
  { i: 'a', x: 0, y: 0, w: 5, h: 5 },
  { i: 'b', x: 5, y: 0, w: 3, h: 5 },
  { i: 'c', x: 8, y: 0, w: 4, h: 5 },
  { i: 'd', x: 0, y: 15, w: 12, h: 2 },
]

const layouts = { lg: layout }
function App() {
  // const [rowHeight, setRowHeight] = useState(0)
  const mainStore = useSymbolStore()

  useEffect(() => {
    console.log(mainStore.getSuggestedSymbols())
    // setRowHeight(window.innerHeight / 12)
  }, [])

  console.log(mainStore.symbols)

  return (
    <>
      <ResponsiveGridLayout
        layouts={layouts}
        isDraggable={false}
        autoSize={false}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        // rowHeight={rowHeight}
        width={document.body.clientWidth}
      >
        <div key="a">
          <Card title="Arco Card">
            news recommendation engine and gradually evolved into a platform delivering content in various formats.
          </Card>
        </div>
        <div key="b">
          <Card title="Arco Card">
            <div>Test</div>
          </Card>
        </div>
        <div key="c">
          <Card className="datatable-card">
            <SymbolTable />
          </Card>
        </div>
        <div key="d">
          <Card title="Algo trading">
            <Algo />
          </Card>
        </div>
      </ResponsiveGridLayout>
    </>
  )
}

export default App
