import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { Provider } from 'react-redux'
import store from './store/store'
import { ThemeProvider } from '@mui/material/styles'
import global_theme from './styles/themes'
import './configs/i18n'
import SentryErrorBoundary from './utils/error_boundary'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={global_theme}>
        <SentryErrorBoundary>
          <App />
        </SentryErrorBoundary>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)