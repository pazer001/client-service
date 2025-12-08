import { AppBar, Box, Grid, Paper, type PaperProps, Stack, styled, ToggleButton, Toolbar } from '@mui/material'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import useMediaQuery from '@mui/material/useMediaQuery'
import { BaseSyntheticEvent, useState } from 'react';
import Logo from './assets/logos/horizontal-color-logo-no-background.svg'
import LogoWithoutText from './assets/logos/logo-without-text.svg'
import { StartAlgo } from './components/Algo/StartAlgo.tsx'
// import AnalyzedResult from './components/AnalyzedResult/AnalyzedResult'
import Balance from './components/Balance/Balance.tsx'
import { Interval } from './components/interfaces.ts'
import { MobileView } from './components/MobileView/MobileView.tsx'
import { TablesContainer } from './components/TablesContainer/TablesContainer.tsx'
import {
  useSymbataStoreActions,
  useSymbataStoreInterval,
  useSymbataStoreIsAlgoStarted,
  useSymbataStoreUserId,
} from './stores/symbataStore.ts'
import Messages from './components/AnalyzedResult/AnalyzedResult';
import TradingViewWidget from './components/Chart/TradingViewWidget.tsx';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from './axios';


const spacingBetween = 1
const fullHeightStyleProp = { height: '100%' }

interface IUser {email: string, googleId: string, name: string, picture: string}

// Define custom props interface for styled component
interface ItemProps extends PaperProps {
  isMobile?: boolean
}


// Item copied from MUI documentation
// https://mui.com/material-ui/react-grid/#limitations
const Item = styled(Paper)<ItemProps>(({ theme, isMobile }) => ({
  padding: theme.spacing(spacingBetween),
  ...fullHeightStyleProp,
  ...(isMobile && {
    height: 'inherit',
    overflowY: 'auto',
  }),
}))

const MainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(spacingBetween),
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(spacingBetween),
}))

const IntervalController = () => {
  const interval = useSymbataStoreInterval()
  const userId = useSymbataStoreUserId()
  const isAlgoStared = useSymbataStoreIsAlgoStarted()
  const { setInterval, setIsAlgoStarted, stopAlgo } = useSymbataStoreActions()

  const onChangeInterval = (event: BaseSyntheticEvent) => {
    setInterval(event.target.value as Interval)
    if (isAlgoStared) {
      setIsAlgoStarted(false)
      stopAlgo(userId)
    }
  }

  return (
    <ToggleButtonGroup value={interval} size="small" exclusive onChange={onChangeInterval}>
      <ToggleButton size="small" value={Interval['1d']}>
        {Interval['1d']}
      </ToggleButton>
      <ToggleButton size="small" value={Interval['15m']}>
        {Interval['15m']}
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

function App() {
  const isMobile = useMediaQuery('(max-width:900px)')
  const [user, setUser] = useState<{success?: boolean, user?: IUser}>({});

  const verifyLogin = async (credentials: CredentialResponse) => {
    const response = await axios.post("/users/google", credentials)
    console.log(response.data)
    setUser(response.data)
  }

  return (
    <MainContainer>
      <GoogleOAuthProvider clientId="244255872191-gjt6ujt551uka46mtklpk1bi49it4tde.apps.googleusercontent.com">
      <AppBar position="static">
        <Toolbar variant="dense">
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <img alt="Symbata logo" src={isMobile ? LogoWithoutText : Logo} height={isMobile ? '20px' : '30px'} />
            <Box display="flex" alignItems="center" gap={2}>
              <StartAlgo />
              <IntervalController />
              {!user.success && <GoogleLogin
                onSuccess={credentialResponse => {
                  // console.log(credentialResponse);
                  verifyLogin(credentialResponse)
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
                auto_select
              />}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {isMobile ? (
        <MobileView Item={Item} spacingBetween={spacingBetween} />
      ) : (
        <>
          <Grid container spacing={spacingBetween} sx={{ ...fullHeightStyleProp }}>
            <Grid size={6}>
              <Stack spacing={spacingBetween} sx={{ ...fullHeightStyleProp }}>
                <Item>
                  <TradingViewWidget />
                </Item>
                <Item sx={{ height: 'calc(100% / 2)' }}>
                  <Balance />
                </Item>
              </Stack>
            </Grid>
            <Grid size={2}>
              <Item>
                <Messages />
              </Item>
            </Grid>
            <Grid size={4}>
              <Item sx={{ paddingTop: 0 }}>
                <TablesContainer />
              </Item>
            </Grid>
          </Grid>
        </>
      )}
    </GoogleOAuthProvider>
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
