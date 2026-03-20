import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'

// Apply saved theme to <html> before first render to avoid a flash
const saved = localStorage.getItem('theme') ?? 'system'
const html = document.documentElement
if (saved === 'dark') {
  html.classList.add('dark')
} else if (saved === 'light') {
  html.classList.remove('dark')
} else {
  html.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </Provider>
  </StrictMode>
)
