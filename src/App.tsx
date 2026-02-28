import SettingsIcon from '@mui/icons-material/Settings'
import { AppBar, Box, Grid, IconButton, Paper, type PaperProps, Stack, styled, Toolbar, Tooltip } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect, useState } from 'react'
import Logo from './assets/logos/horizontal-color-logo-no-background.svg'
import LogoWithoutText from './assets/logos/logo-without-text.svg'
import axios from 'axios'
import ActionMessages, { LogMessage } from './components/ActionMessages/ActionMessages.tsx';
import { AlgoConfigModal } from './components/Algo/AlgoConfigModal.tsx'
import { StartAlgo } from './components/Algo/StartAlgo.tsx'
import Balance from './components/Balance/Balance.tsx'
import TradingViewWidget from './components/Chart/TradingViewWidget.tsx'
import { MobileView } from './components/MobileView/MobileView.tsx'
import { useSymbataStoreActions, useSymbataStoreUserId } from './stores/symbataStore.ts'
import { io } from 'socket.io-client';
import { OpenPositions } from './components/TablesContainer/OpenPositions/OpenPositions.tsx';
import { IOpenPositionsResponse } from './stores/symbataStore.types.ts';

const spacingBetween = 1
const fullHeightStyleProp = { height: '100%' }

interface IUser {
  email: string
  googleId: string
  name: string
  picture: string
}

// Define custom props interface for styled component
interface ItemProps extends PaperProps {
  isMobile?: boolean
}

const MAX_MESSAGES = 100

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

let messageIdCounter = 0
const generateMessageId = () => `msg-${++messageIdCounter}`

function App() {
  const isMobile = useMediaQuery('(max-width:900px)')
  const [user, setUser] = useState<{ success?: boolean; user?: IUser }>({})
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [messages, setMessages] = useState<LogMessage[]>([])
  const accountId = useSymbataStoreUserId()
  const [storeOpenPositions, setStoreOpenPositions] = useState<IOpenPositionsResponse>({})

  const userId = useSymbataStoreUserId()
  const { getAlgoSession } = useSymbataStoreActions()

  // Fetch algo session config on init and when user changes
  useEffect(() => {
    getAlgoSession(userId)
  }, [userId, getAlgoSession])

  const verifyLogin = async (credentials: CredentialResponse) => {
    const response = await axios.post('/users/google', credentials)
    setUser(response.data)
  }

  useEffect(() => {

    // Connect to WebSocket server
    const newSocket = io(import.meta.env.VITE_API_HOST)

    newSocket.on('connect', () => {      // Register accountId
      newSocket.emit('register', { accountId })
    })

    newSocket.on('currentOpenPositions', (positions) => {
      // console.log("Received current open positions:", positions)
      setStoreOpenPositions(positions)
    })

    newSocket.on(
      'algoLog',
      (message: { type: 'general' | 'recommendation' | 'buy' | 'sell'; message: string; profit?: number }) => {
        // console.log('Received:', message)
        setMessages((prev) => {
          const newMessage: LogMessage = {
            id: generateMessageId(),
            text: message.message,
            type: message.type,
            timestamp: new Date(),
            // Include profit for sell messages if provided by server
            ...(message.type === 'sell' && message.profit !== undefined ? { profit: message.profit } : {}),
          }
          const updated = [...prev, newMessage]
          // Remove oldest messages if exceeding limit to prevent memory leak
          return updated.length > MAX_MESSAGES ? updated.slice(-MAX_MESSAGES) : updated
        })
      },
    )



    newSocket.on('registered', (data) => {
      console.log('Registered:', data)
    })

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [accountId])

  return (
    <MainContainer>
      <GoogleOAuthProvider clientId="244255872191-gjt6ujt551uka46mtklpk1bi49it4tde.apps.googleusercontent.com">
        <AppBar position="static">
          <Toolbar variant="dense">
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <img alt="Symbata logo" src={isMobile ? LogoWithoutText : Logo} height={isMobile ? '20px' : '30px'} />
              <Box display="flex" alignItems="center" gap={2}>
                <StartAlgo />
                <Tooltip title="Algo Configuration">
                  <IconButton size="small" onClick={() => setIsConfigModalOpen(true)}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                {!user.success && (
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      // console.log(credentialResponse);
                      verifyLogin(credentialResponse)
                    }}
                    onError={() => {
                      console.log('Login Failed')
                    }}
                    useOneTap
                    auto_select
                  />
                )}
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
                  <ActionMessages messages={messages} />
                </Item>
              </Grid>
              <Grid size={4}>
                <Item sx={{ paddingTop: 0 }}>
                  <OpenPositions openPositions={storeOpenPositions} />
                </Item>
              </Grid>
            </Grid>
          </>
        )}
      </GoogleOAuthProvider>
      <AlgoConfigModal open={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} />
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
            <ActionMessages />
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
