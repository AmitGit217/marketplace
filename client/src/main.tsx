import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ColorModeProvider } from './components/ui/color-mode.tsx'
import { BrowserRouter } from 'react-router-dom'
import { system } from './theme.ts'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './context/authContext'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ChakraProvider value={system}>
      <ColorModeProvider>
      <AuthProvider   >
      <App />
      </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
