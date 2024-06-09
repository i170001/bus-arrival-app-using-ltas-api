import React from 'react'
import ReactDOM from 'react-dom/client'
import { extendTheme, ChakraProvider } from "@chakra-ui/react"
import App from './App.jsx'
import './index.css'
import './fonts/fonts.css'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "comic-sans-ms, sans-serif",
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