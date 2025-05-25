import { AppBar, Box, Grid, Paper, Stack, styled, Toolbar } from '@mui/material'
import AnalyzedResult from './components/AnalyzedResult/AnalyzedResult'
import { TablesContainer } from './components/TablesContainer/TablesContainer.tsx'

const spacingBetween = 1
const fullHeightStyleProp = { height: '100%' }

// Item copied from MUI documentation
// https://mui.com/material-ui/react-grid/#limitations
const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(spacingBetween),
  ...fullHeightStyleProp,
}))

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(spacingBetween),
  height: '100%',
  maxHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(spacingBetween),
}))

function App() {
  return (
    <Container>
      <AppBar position="static">
        <Toolbar variant="dense"></Toolbar>
      </AppBar>
      <Grid container spacing={spacingBetween} sx={{ ...fullHeightStyleProp }}>
        <Grid size={6}>
          <Stack spacing={spacingBetween} sx={{ ...fullHeightStyleProp }}>
            <Item></Item>
            <Item sx={{ height: 'calc(100% / 2)' }}></Item>
          </Stack>
        </Grid>
        <Grid size={2}>
          <Item>
            <AnalyzedResult />
          </Item>
        </Grid>
        <Grid size={4}>
          <Item sx={{ paddingTop: 0 }}>
            <TablesContainer />
          </Item>
        </Grid>
      </Grid>
    </Container>
  )
}

/**
const layoutLg = [
  { i: 'a', x: 0, y: 0, w: 5, h: 5 },
  { i: 'b', x: 5, y: 0, w: 3, h: 5 },
  { i: 'c', x: 8, y: 0, w: 4, h: 7.87 },
  { i: 'd', x: 0, y: 15, w: 8, h: 2.87 },
]

const layouts = { lg: layoutLg }
function App() {
  return (
    <>
      <ResponsiveGridLayout
        layouts={layouts}
        isDraggable={false}
        autoSize={true}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        width={document.body.clientWidth}
      >
        <div key="a">
          <Card pt={{ root: { className: 'h-full' } }} title="Symbols">
            news recommendation engine and gradually evolved into a platform delivering content in various formats.
          </Card>
        </div>
        <div key="b">
          <Card pt={{ root: { className: 'h-full' } }} title="Analyzed Result">
            <AnalyzedResult />
          </Card>
        </div>
        <div key="c">
          <Card
            title="Symbols"
            pt={{
              root: { className: 'h-full' },
              body: { className: 'h-full' },
              content: {
                className: 'p-0 h-full',
                style: {
                  maxHeight: 'calc(100% - 15px)',
                },
              },
            }}
          >
            <SymbolsTable />
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
  */

export default App
