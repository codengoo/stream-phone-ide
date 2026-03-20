import { useAppTab } from '@hooks/useAppTab'
import { IconDeviceMobile, IconInfoCircle, IconSettings } from '@tabler/icons-react'
import React from 'react'
import { SideBtn } from './components/SideBtn'
import { ThemeBtn } from './components/ThemeBtn'

interface Props {
  onSettings?: () => void
}

export function Sidebar({ onSettings }: Props): React.JSX.Element {
  const { activeTab, setTab } = useAppTab()

  return (
    <div className="flex h-full w-14 flex-shrink-0 flex-col items-center gap-1 border-r border-slate-200 bg-slate-100 pb-2 pt-2 dark:border-slate-800 dark:bg-[#0b0d15]">
      <SideBtn
        icon={<IconDeviceMobile size={20} />}
        title="Devices"
        isActive={activeTab === 'devices'}
        onPress={() => setTab('devices')}
      />
      <SideBtn
        icon={<IconInfoCircle size={20} />}
        title="Info"
        isActive={activeTab === 'info'}
        onPress={() => setTab('info')}
      />
      <div className="flex-1" />

      {/* Theme popover */}

      <ThemeBtn />
      <SideBtn
        icon={<IconSettings size={20} />}
        title="Settings"
        isActive={false}
        onPress={() => onSettings?.()}
      />
    </div>
  )
}

export default Sidebar
