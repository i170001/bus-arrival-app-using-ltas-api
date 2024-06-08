import React from 'react'
import ReactDOM from 'react-dom/client'
import { extendTheme, ChakraProvider } from "@chakra-ui/react"
import App from './App.jsx'
import './index.css'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)