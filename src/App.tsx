import { AppBar, Box, Grid, Paper, Stack, styled, ToggleButton, Toolbar } from '@mui/material'
import AnalyzedResult from './components/AnalyzedResult/AnalyzedResult'
import { TablesContainer } from './components/TablesContainer/TablesContainer.tsx'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useSymbataStoreActions, useSymbataStoreInterval } from './stores/symbataStore.ts'
import { Interval } from './components/interfaces.ts'
import { BaseSyntheticEvent } from 'react'
import Logo from './assets/logos/horizontal-color-logo-no-background.svg'
import Chart from './components/Chart/Chart.tsx'
import Algo from './components/Algo/Algo.tsx'

const spacingBetween = 1
const fullHeightStyleProp = { height: '100%' }

// Item copied from MUI documentation
// https://mui.com/material-ui/react-grid/#limitations
const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(spacingBetween),
  ...fullHeightStyleProp,
}))

const MainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(spacingBetween),
  height: '100%',
  maxHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(spacingBetween),
}))

const IntervalController = () => {
  const interval = useSymbataStoreInterval()
  const { setInterval } = useSymbataStoreActions()

  return (
    <ToggleButtonGroup
      value={interval}
      size="small"
      exclusive
      onChange={(event: BaseSyntheticEvent) => setInterval(event.target.value as Interval)}
    >
      <ToggleButton size="small" value={Interval['1d']}>
        {Interval['1d']}
      </ToggleButton>
      <ToggleButton size="small" value={Interval['5m']}>
        {Interval['5m']}
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

function App() {
  return (
    <MainContainer>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <img alt="Symbata logo" src={Logo} height="30px" />
            <IntervalController />
          </Box>
        </Toolbar>
      </AppBar>
      <Grid container spacing={spacingBetween} sx={{ ...fullHeightStyleProp }}>
        <Grid size={6}>
          <Stack spacing={spacingBetween} sx={{ ...fullHeightStyleProp }}>
            <Item>
              <Chart />
            </Item>
            <Item sx={{ height: 'calc(100% / 2)' }}>
              <Algo />
            </Item>
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
    </MainContainer>
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
