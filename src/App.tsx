import { useEffect } from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { useSymbolStore } from './stores/symbolStore'
import { Card } from 'primereact/card'
import 'primereact/resources/themes/lara-dark-cyan/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import 'primeflex/primeflex.css' // flexpa
import { SymbolTable } from './components/SymbolTable/SymbolTable'
import Algo from './components/Algo/Algo.tsx'

const layoutLg = [
  { i: 'a', x: 0, y: 0, w: 5, h: 5 },
  { i: 'b', x: 5, y: 0, w: 3, h: 5 },
  { i: 'c', x: 8, y: 0, w: 4, h: 5 },
  { i: 'd', x: 0, y: 15, w: 12, h: 2.88 },
]

const layouts = { lg: layoutLg }
function App() {
  const mainStore = useSymbolStore()

  useEffect(() => {
    console.log(mainStore.getSuggestedSymbols())
  }, [])

  return (
    <>
      <ResponsiveGridLayout
        layouts={layouts}
        isDraggable={false}
        autoSize={false}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        width={document.body.clientWidth}
      >
        <div key="a">
          <Card pt={{ root: { className: 'h-full' } }} title="Arco Card">
            news recommendation engine and gradually evolved into a platform delivering content in various formats.
          </Card>
        </div>
        <div key="b">
          <Card pt={{ root: { className: 'h-full' } }} title="Arco Card">
            <div>Test</div>
          </Card>
        </div>
        <div key="c">
          <Card
            pt={{
              root: { className: 'h-full' },
              body: { className: 'h-full' },
              content: { className: 'p-0 h-full' },
            }}
          >
            <SymbolTable />
          </Card>
        </div>
        <div key="d">
          <Card pt={{ root: { className: 'h-full' } }} title="Algo trading">
            <Algo />
          </Card>
        </div>
      </ResponsiveGridLayout>
    </>
  )
}

export default App
