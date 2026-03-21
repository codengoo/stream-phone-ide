import './assets/main.css'

import { HeroUIProvider } from '@heroui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </Provider>
  </StrictMode>
)
