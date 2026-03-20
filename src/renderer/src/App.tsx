import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import TitleBar from './components/TitleBar'
import SettingsModal from './components/SettingsModal'
import DevicesPage from './components/pages/devices'
import InfoPage from './components/pages/info'
import { useTheme } from './hooks/useTheme'

function App(): React.JSX.Element {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<'devices' | 'info'>('devices')
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  // Apply dark class to <html> based on Redux theme state
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      root.classList.toggle('dark', mq.matches)
      const handler = (e: MediaQueryListEvent) => root.classList.toggle('dark', e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
    return undefined
  }, [theme])

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 font-sans text-slate-800 dark:bg-[#0d0f1a] dark:text-slate-200">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          active={activeTab}
          onChange={(t) => {
            if (t === 'settings') {
              setSettingsModalOpen(true)
            } else {
              setActiveTab(t as 'devices' | 'info')
            }
          }}
        />
        <SettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
        {activeTab === 'devices' ? <DevicesPage /> : <InfoPage />}
      </div>
    </div>
  )
}

export default App
