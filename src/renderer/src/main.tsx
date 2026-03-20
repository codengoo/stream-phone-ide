import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </Provider>
  </StrictMode>
)
